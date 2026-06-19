const stripe    = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order, Payment } = require('../models');
const AppError   = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { notify } = require('../utils/notification');

// ── Create Stripe PaymentIntent ───────────────────────────────
exports.createPaymentIntent = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError('Order not found.', 404));
  if (!order.user.equals(req.user._id)) return next(new AppError('Not authorized.', 403));
  if (order.paymentStatus === 'paid') {
    return next(new AppError('Order is already paid.', 400));
  }

  // Amount in cents
  const amount = Math.round(order.total * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: {
      orderId:     order._id.toString(),
      orderNumber: order.orderNumber,
      userId:      req.user._id.toString(),
    },
  });

  // Create payment record
  await Payment.create({
    order:            order._id,
    user:             req.user._id,
    gateway:          'stripe',
    gatewayPaymentId: paymentIntent.id,
    amount:           order.total,
    status:           'pending',
  });

  res.json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
      amount:       order.total,
    },
  });
});

// ── Stripe Webhook ────────────────────────────────────────────
exports.stripeWebhook = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ success: false, message: `Webhook error: ${err.message}` });
  }

  const data = event.data.object;

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const payment = await Payment.findOne({ gatewayPaymentId: data.id });
      if (payment) {
        payment.status          = 'succeeded';
        payment.paidAt          = new Date();
        payment.webhookReceived = true;
        await payment.save();

        // Update order
        const order = await Order.findById(payment.order);
        if (order) {
          order.paymentStatus = 'paid';
          order.paidAt        = new Date();
          order.orderStatus   = 'confirmed';
          order.statusHistory.push({ status: 'confirmed', note: 'Payment confirmed via Stripe' });
          await order.save();

          notify.orderPlaced(order.user, order.orderNumber);
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const payment = await Payment.findOne({ gatewayPaymentId: data.id });
      if (payment) {
        payment.status        = 'failed';
        payment.failedAt      = new Date();
        payment.failureReason = data.last_payment_error?.message;
        await payment.save();

        await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'failed' });
      }
      break;
    }

    case 'charge.refunded': {
      const paymentIntent = await stripe.paymentIntents.retrieve(data.payment_intent);
      const payment = await Payment.findOne({ gatewayPaymentId: paymentIntent.id });
      if (payment) {
        payment.status       = 'refunded';
        payment.refundAmount = data.amount_refunded / 100;
        payment.refundedAt   = new Date();
        await payment.save();

        await Order.findByIdAndUpdate(payment.order, {
          paymentStatus: 'refunded',
          orderStatus:   'refunded',
        });
      }
      break;
    }

    default:
      break;
  }

  res.json({ received: true });
});

// ── Get payment by order id ───────────────────────────────────
exports.getPaymentByOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return next(new AppError('Order not found.', 404));
  if (!order.user.equals(req.user._id) && req.user.role !== 'admin') {
    return next(new AppError('Not authorized.', 403));
  }

  const payment = await Payment.findOne({ order: req.params.orderId }).select('-webhookData');
  if (!payment) return next(new AppError('Payment not found.', 404));

  res.json({ success: true, data: payment });
});

// ── Admin: refund order ───────────────────────────────────────
exports.refundPayment = catchAsync(async (req, res, next) => {
  const { reason } = req.body;
  const payment = await Payment.findById(req.params.paymentId);
  if (!payment) return next(new AppError('Payment not found.', 404));
  if (payment.status !== 'succeeded') {
    return next(new AppError('Only succeeded payments can be refunded.', 400));
  }

  const refund = await stripe.refunds.create({
    payment_intent: payment.gatewayPaymentId,
    reason:         reason || 'requested_by_customer',
  });

  payment.status          = 'refunded';
  payment.refundAmount    = payment.amount;
  payment.refundedAt      = new Date();
  payment.refundReason    = reason;
  payment.gatewayRefundId = refund.id;
  await payment.save();

  await Order.findByIdAndUpdate(payment.order, {
    paymentStatus: 'refunded',
    orderStatus:   'refunded',
  });

  res.json({ success: true, message: 'Refund processed', data: { refundId: refund.id } });
});
