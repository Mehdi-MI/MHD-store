const mongoose = require('mongoose');

/* ── Order item sub-schema ── */
const OrderItemSchema = new mongoose.Schema({
  product:       { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  seller:        { type: mongoose.Schema.Types.ObjectId, ref: 'Seller',  required: true },
  name:          { type: String,  required: true },   // snapshot at time of order
  image:         { type: String,  default: null },
  price:         { type: Number,  required: true },
  quantity:      { type: Number,  required: true, min: 1 },
  selectedSize:  { type: String,  default: null },
  selectedColor: { type: String,  default: null },
  sku:           { type: String,  default: null },
  subtotal:      { type: Number,  required: true },   // price * quantity
}, { _id: true });

/* ── Shipping address snapshot ── */
const ShippingAddressSchema = new mongoose.Schema({
  fullName:     { type: String, required: true },
  phone:        { type: String, required: true },
  country:      { type: String, required: true },
  city:         { type: String, required: true },
  state:        { type: String },
  postalCode:   { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
}, { _id: false });

/* ── Status history sub-schema ── */
const StatusHistorySchema = new mongoose.Schema({
  status:    { type: String, required: true },
  note:      { type: String, default: null },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

/* ── Main Order schema ── */
const OrderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber:     { type: String, unique: true },   // e.g. MHD-20250001

  items:           [OrderItemSchema],

  shippingAddress: ShippingAddressSchema,

  // Pricing breakdown
  subtotal:        { type: Number, required: true },
  shippingCost:    { type: Number, default: 0 },
  taxAmount:       { type: Number, default: 0 },
  discountAmount:  { type: Number, default: 0 },
  total:           { type: Number, required: true },

  // Coupon
  coupon: {
    code:           { type: String,  default: null },
    discountType:   { type: String,  enum: ['percentage', 'fixed'], default: null },
    discountValue:  { type: Number,  default: 0 },
  },

  // Payment
  paymentMethod:  { type: String, enum: ['stripe', 'paypal', 'cod'], required: true },
  paymentStatus:  { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paidAt:         { type: Date,   default: null },

  // Order status
  orderStatus: {
    type:    String,
    enum:    ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  statusHistory: [StatusHistorySchema],

  // Shipping tracking
  tracking: {
    carrier:        { type: String, default: null },
    trackingNumber: { type: String, default: null },
    trackingUrl:    { type: String, default: null },
    shippedAt:      { type: Date,   default: null },
    estimatedDelivery: { type: Date, default: null },
    deliveredAt:    { type: Date,   default: null },
  },

  // Notes
  customerNote: { type: String, default: null },
  adminNote:    { type: String, default: null },

  // Invoice
  invoiceUrl:   { type: String, default: null },

  // Cancellation
  cancelledAt:     { type: Date,   default: null },
  cancellationReason: { type: String, default: null },

}, {
  timestamps: true,
});

/* ── Auto-generate order number ── */
OrderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const year  = new Date().getFullYear();
    this.orderNumber = `MHD-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

/* ── Indexes ── */
OrderSchema.index({ user: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'items.seller': 1 });

module.exports = mongoose.model('Order', OrderSchema);
