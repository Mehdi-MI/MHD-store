const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  order:          { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },

  // Payment gateway
  gateway:        { type: String, enum: ['stripe', 'paypal'], required: true },
  gatewayPaymentId: { type: String, required: true },   // Stripe PaymentIntent ID / PayPal order ID
  gatewayCustomerId: { type: String, default: null },

  // Amounts
  amount:         { type: Number, required: true },
  currency:       { type: String, default: 'USD' },
  fee:            { type: Number, default: 0 },         // gateway fee
  net:            { type: Number, default: 0 },         // amount - fee

  // Status
  status: {
    type:    String,
    enum:    ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending',
  },

  // Refund
  refundAmount:   { type: Number, default: 0 },
  refundedAt:     { type: Date,   default: null },
  refundReason:   { type: String, default: null },
  gatewayRefundId:{ type: String, default: null },

  // Card details (non-sensitive — last 4 only)
  card: {
    brand:  { type: String, default: null },   // visa, mastercard
    last4:  { type: String, default: null },
    expMonth: { type: Number, default: null },
    expYear:  { type: Number, default: null },
  },

  // Webhook
  webhookReceived: { type: Boolean, default: false },
  webhookData:     { type: mongoose.Schema.Types.Mixed, default: null, select: false },

  paidAt:   { type: Date, default: null },
  failedAt: { type: Date, default: null },
  failureReason: { type: String, default: null },

}, {
  timestamps: true,
});

PaymentSchema.index({ order: 1 });
PaymentSchema.index({ user: 1 });
PaymentSchema.index({ gatewayPaymentId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);
