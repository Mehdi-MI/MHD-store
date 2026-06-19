const { Cart, Product, Seller, Coupon } = require('../models');
const AppError   = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Helper: fetch or create cart for user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  // Reset TTL on activity
  cart.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return cart;
};

// ── Get cart ──────────────────────────────────────────────────
exports.getCart = catchAsync(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path:   'items.product',
      select: 'name images price stock status seller',
      populate: { path: 'seller', select: 'storeName storeSlug' },
    });

  if (!cart) {
    return res.json({ success: true, data: { items: [], total: 0, itemCount: 0 } });
  }

  // Calculate totals
  const subtotal   = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount  = cart.items.reduce((s, i) => s + i.quantity, 0);
  const discountAmt = cart.coupon?.discountValue
    ? cart.coupon.discountType === 'percentage'
      ? (subtotal * cart.coupon.discountValue) / 100
      : cart.coupon.discountValue
    : 0;

  res.json({
    success: true,
    data: {
      items:     cart.items,
      coupon:    cart.coupon,
      subtotal,
      discount:  discountAmt,
      total:     Math.max(0, subtotal - discountAmt),
      itemCount,
    },
  });
});

// ── Add item to cart ──────────────────────────────────────────
exports.addItem = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1, selectedSize, selectedColor } = req.body;

  const product = await Product.findById(productId).populate('seller');
  if (!product) return next(new AppError('Product not found.', 404));
  if (product.status !== 'active' || !product.isApproved) {
    return next(new AppError('Product is not available.', 400));
  }
  if (product.trackStock && product.stock < quantity) {
    return next(new AppError(`Only ${product.stock} units available.`, 400));
  }

  const cart = await getOrCreateCart(req.user._id);

  // Find existing item (same product + size + color)
  const existIdx = cart.items.findIndex(
    i =>
      i.product.toString() === productId &&
      (i.selectedSize  || null) === (selectedSize  || null) &&
      (i.selectedColor || null) === (selectedColor || null)
  );

  if (existIdx >= 0) {
    const newQty = cart.items[existIdx].quantity + quantity;
    if (product.trackStock && newQty > product.stock) {
      return next(new AppError(`Only ${product.stock} units available.`, 400));
    }
    cart.items[existIdx].quantity = newQty;
  } else {
    cart.items.push({
      product:       product._id,
      seller:        product.seller._id,
      quantity,
      selectedSize:  selectedSize  || null,
      selectedColor: selectedColor || null,
      price:         product.price,
    });
  }

  await cart.save();

  res.json({ success: true, message: 'Item added to cart', data: { itemCount: cart.items.length } });
});

// ── Update item quantity ───────────────────────────────────────
exports.updateItem = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  if (quantity < 1) return next(new AppError('Quantity must be at least 1.', 400));

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found.', 404));

  const item = cart.items.id(req.params.itemId);
  if (!item) return next(new AppError('Item not found in cart.', 404));

  const product = await Product.findById(item.product);
  if (product?.trackStock && quantity > product.stock) {
    return next(new AppError(`Only ${product.stock} units available.`, 400));
  }

  item.quantity = quantity;
  await cart.save();

  res.json({ success: true, message: 'Cart updated', data: { itemCount: cart.items.length } });
});

// ── Remove item ───────────────────────────────────────────────
exports.removeItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found.', 404));

  const item = cart.items.id(req.params.itemId);
  if (!item) return next(new AppError('Item not found in cart.', 404));

  item.deleteOne();
  await cart.save();

  res.json({ success: true, message: 'Item removed', data: { itemCount: cart.items.length } });
});

// ── Clear cart ────────────────────────────────────────────────
exports.clearCart = catchAsync(async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], coupon: { code: null, discountType: null, discountValue: 0 } }
  );
  res.json({ success: true, message: 'Cart cleared' });
});

// ── Apply coupon ───────────────────────────────────────────────
exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne({
    code:     code.toUpperCase(),
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    $or: [{ startsAt: null }, { startsAt: { $lte: new Date() } }],
  });

  if (!coupon) return next(new AppError('Invalid or expired coupon code.', 400));

  // Check usage limits
  if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
    return next(new AppError('Coupon usage limit reached.', 400));
  }

  // Check per-user usage
  const userUsage = coupon.usageLog.filter(
    l => l.user?.toString() === req.user._id.toString()
  ).length;
  if (userUsage >= coupon.maxUsagePerUser) {
    return next(new AppError('You have already used this coupon.', 400));
  }

  // Check minimum order amount
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart is empty.', 400));

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  if (subtotal < coupon.minOrderAmount) {
    return next(
      new AppError(`Minimum order amount is $${coupon.minOrderAmount}.`, 400)
    );
  }

  cart.coupon = {
    code:          coupon.code,
    discountType:  coupon.discountType,
    discountValue: coupon.discountValue,
  };
  await cart.save();

  const discountAmt = coupon.discountType === 'percentage'
    ? (subtotal * coupon.discountValue) / 100
    : coupon.discountValue;

  res.json({
    success: true,
    message: 'Coupon applied',
    data: {
      coupon: {
        code:          coupon.code,
        discountType:  coupon.discountType,
        discountValue: coupon.discountValue,
        label:         coupon.discountType === 'percentage'
          ? `${coupon.discountValue}% off`
          : `$${coupon.discountValue} off`,
      },
      discountAmount: discountAmt,
    },
  });
});

// ── Remove coupon ─────────────────────────────────────────────
exports.removeCoupon = catchAsync(async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { coupon: { code: null, discountType: null, discountValue: 0 } }
  );
  res.json({ success: true, message: 'Coupon removed' });
});
