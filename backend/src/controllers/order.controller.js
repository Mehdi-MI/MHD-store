const { Order, Cart, Product, Seller, Coupon } = require('../models');
const AppError   = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { notify } = require('../utils/notification');

// ── Create order ──────────────────────────────────────────────
exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress, paymentMethod, customerNote } = req.body;

  // Load cart
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name images price stock status isApproved seller sku',
  });

  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty.', 400));
  }

  // Validate each item
  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || product.status !== 'active' || !product.isApproved) {
      return next(new AppError(`Product "${product?.name}" is no longer available.`, 400));
    }
    if (product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for "${product.name}".`, 400));
    }
    orderItems.push({
      product:       product._id,
      seller:        item.seller,
      name:          product.name,
      image:         product.images?.[0] || null,
      price:         item.price,
      quantity:      item.quantity,
      selectedSize:  item.selectedSize,
      selectedColor: item.selectedColor,
      sku:           product.sku,
      subtotal:      item.price * item.quantity,
    });
  }

  // Pricing
  const subtotal     = orderItems.reduce((s, i) => s + i.subtotal, 0);
  const shippingCost = subtotal >= 150 ? 0 : 12;
  const taxAmount    = Math.round(subtotal * 0.08 * 100) / 100;

  // Coupon
  let discountAmount = 0;
  let couponData     = {};
  if (cart.coupon?.code) {
    const coupon = await Coupon.findOne({ code: cart.coupon.code, isActive: true });
    if (coupon) {
      discountAmount = coupon.discountType === 'percentage'
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;
      if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      couponData = {
        code:          coupon.code,
        discountType:  coupon.discountType,
        discountValue: coupon.discountValue,
      };
      // Record usage
      coupon.usageCount += 1;
      coupon.usageLog.push({ user: req.user._id, discount: discountAmount });
      await coupon.save();
    }
  }

  const total = Math.max(0, subtotal + shippingCost + taxAmount - discountAmount);

  // Create order
  const order = await Order.create({
    user:            req.user._id,
    items:           orderItems,
    shippingAddress,
    subtotal,
    shippingCost,
    taxAmount,
    discountAmount,
    coupon:          couponData,
    total,
    paymentMethod,
    customerNote,
    statusHistory: [{ status: 'pending', changedBy: req.user._id }],
  });

  // Decrement stock
  await Promise.all(
    orderItems.map(item =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, salesCount: item.quantity },
      })
    )
  );

  // Update seller metrics (per-seller revenue)
  const sellerRevenue = {};
  orderItems.forEach(item => {
    const sid = item.seller.toString();
    sellerRevenue[sid] = (sellerRevenue[sid] || 0) + item.subtotal;
  });
  await Promise.all(
    Object.entries(sellerRevenue).map(([sellerId, revenue]) =>
      Seller.findByIdAndUpdate(sellerId, {
        $inc: { 'metrics.totalOrders': 1, 'metrics.totalRevenue': revenue },
      })
    )
  );

  // Clear cart
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], coupon: { code: null, discountType: null, discountValue: 0 } }
  );

  // Notify customer
  notify.orderPlaced(req.user._id, order.orderNumber);

  res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
});

// ── Get my orders ─────────────────────────────────────────────
exports.getMyOrders = catchAsync(async (req, res) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip  = (page - 1) * limit;

  const filter = { user: req.user._id };
  if (req.query.status) filter.orderStatus = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .select('orderNumber orderStatus paymentStatus total items createdAt tracking'),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, data: { orders, total, page, pages: Math.ceil(total / limit) } });
});

// ── Get single order ──────────────────────────────────────────
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'fullName email');

  if (!order) return next(new AppError('Order not found.', 404));

  // Only owner or admin
  if (req.user.role !== 'admin' && !order.user._id.equals(req.user._id)) {
    return next(new AppError('Not authorized to view this order.', 403));
  }

  res.json({ success: true, data: order });
});

// ── Update order status (admin / seller) ──────────────────────
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderStatus, tracking, adminNote } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found.', 404));

  // Sellers can only update their own orders
  if (req.user.role === 'seller') {
    const seller = await Seller.findOne({ user: req.user._id });
    const isSeller = order.items.some(i => i.seller.equals(seller?._id));
    if (!isSeller) return next(new AppError('Not authorized.', 403));

    const allowedBySeller = ['processing', 'shipped', 'delivered'];
    if (!allowedBySeller.includes(orderStatus)) {
      return next(new AppError(`Sellers cannot set status to "${orderStatus}".`, 403));
    }
  }

  const prevStatus = order.orderStatus;
  order.orderStatus = orderStatus;
  order.statusHistory.push({ status: orderStatus, changedBy: req.user._id, note: adminNote });

  if (tracking) order.tracking = { ...order.tracking, ...tracking };
  if (adminNote) order.adminNote = adminNote;

  // Handle specific status transitions
  if (orderStatus === 'shipped' && tracking?.trackingNumber) {
    order.tracking.shippedAt = new Date();
    notify.orderShipped(order.user, order.orderNumber, tracking.trackingNumber);
  }
  if (orderStatus === 'delivered') {
    order.tracking.deliveredAt = new Date();
    notify.orderDelivered(order.user, order.orderNumber);
  }
  if (orderStatus === 'cancelled') {
    order.cancelledAt        = new Date();
    order.cancellationReason = req.body.cancellationReason;
    // Restore stock
    await Promise.all(
      order.items.map(item =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, salesCount: -item.quantity },
        })
      )
    );
  }

  await order.save();

  res.json({ success: true, message: 'Order status updated', data: order });
});

// ── Cancel order (customer) ───────────────────────────────────
exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found.', 404));
  if (!order.user.equals(req.user._id)) return next(new AppError('Not authorized.', 403));

  const cancellable = ['pending', 'confirmed'];
  if (!cancellable.includes(order.orderStatus)) {
    return next(new AppError(`Order cannot be cancelled at "${order.orderStatus}" stage.`, 400));
  }

  order.orderStatus        = 'cancelled';
  order.cancelledAt        = new Date();
  order.cancellationReason = req.body.reason || 'Cancelled by customer';
  order.statusHistory.push({ status: 'cancelled', changedBy: req.user._id });

  // Restore stock
  await Promise.all(
    order.items.map(item =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    )
  );

  await order.save();

  res.json({ success: true, message: 'Order cancelled', data: order });
});

// ── Seller: get orders containing their items ─────────────────
exports.getSellerOrders = catchAsync(async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) return next(new AppError('Seller profile not found.', 404));

  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip  = (page - 1) * limit;

  const filter = { 'items.seller': seller._id };
  if (req.query.status) filter.orderStatus = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort('-createdAt').skip(skip).limit(limit)
      .populate('user', 'fullName email')
      .select('orderNumber user orderStatus paymentStatus items shippingAddress total createdAt tracking'),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, data: { orders, total, page, pages: Math.ceil(total / limit) } });
});

// ── Admin: get all orders ─────────────────────────────────────
exports.adminGetOrders = catchAsync(async (req, res) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.status)  filter.orderStatus  = req.query.status;
  if (req.query.payment) filter.paymentStatus = req.query.payment;
  if (req.query.search) {
    filter.orderNumber = new RegExp(req.query.search, 'i');
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort('-createdAt').skip(skip).limit(limit)
      .populate('user', 'fullName email'),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, data: { orders, total, page, pages: Math.ceil(total / limit) } });
});
