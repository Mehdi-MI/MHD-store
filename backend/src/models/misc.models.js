const mongoose = require('mongoose');

// ── Coupon ────────────────────────────────────────────────────
const CouponSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  description:   { type: String, default: null },
  discountType:  { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  maxDiscount:   { type: Number, default: null },
  minOrderAmount:{ type: Number, default: 0 },
  maxUsage:      { type: Number, default: null },
  maxUsagePerUser: { type: Number, default: 1 },
  usageCount:    { type: Number, default: 0 },
  appliesTo:     { type: String, enum: ['all', 'category', 'product', 'seller'], default: 'all' },
  categories:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  products:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'  }],
  sellers:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller'   }],
  eligibleUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  firstOrderOnly:{ type: Boolean, default: false },
  startsAt:      { type: Date, default: Date.now },
  expiresAt:     { type: Date, default: null },
  isActive:      { type: Boolean, default: true },
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  usageLog: [{
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order:   { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    usedAt:  { type: Date, default: Date.now },
    discount:{ type: Number },
  }],
}, { timestamps: true });
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1 });
CouponSchema.index({ expiresAt: 1 });
const Coupon = mongoose.model('Coupon', CouponSchema);

// ── Notification ──────────────────────────────────────────────
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'order_placed', 'order_confirmed', 'order_shipped',
      'order_delivered', 'order_cancelled', 'order_refunded',
      'payment_success', 'payment_failed',
      'review_received', 'seller_reply',
      'product_back_in_stock', 'price_drop',
      'seller_approved', 'seller_rejected', 'seller_suspended',
      'new_message', 'promo', 'system',
    ],
    required: true,
  },
  title:  { type: String, required: true },
  body:   { type: String, required: true },
  image:  { type: String, default: null },
  link:   { type: String, default: null },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date,   default: null },
  ref: {
    model: { type: String, enum: ['Order', 'Product', 'Review', 'Seller', null], default: null },
    id:    { type: mongoose.Schema.Types.ObjectId, default: null },
  },
}, { timestamps: true });
NotificationSchema.index({ user: 1, isRead: 1 });
NotificationSchema.index({ user: 1, createdAt: -1 });
const Notification = mongoose.model('Notification', NotificationSchema);

// ── Payout ────────────────────────────────────────────────────
const PayoutSchema = new mongoose.Schema({
  seller:          { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  periodStart:     { type: Date, required: true },
  periodEnd:       { type: Date, required: true },
  grossSales:      { type: Number, required: true },
  commissionFee:   { type: Number, required: true },
  gatewayFees:     { type: Number, default: 0 },
  refundDeductions:{ type: Number, default: 0 },
  netAmount:       { type: Number, required: true },
  orders:          [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  status:          { type: String, enum: ['pending', 'processing', 'paid', 'failed', 'on_hold'], default: 'pending' },
  gateway:         { type: String, enum: ['stripe', 'paypal', 'bank'] },
  gatewayPayoutId: { type: String, default: null },
  gatewayResponse: { type: mongoose.Schema.Types.Mixed, default: null, select: false },
  paidAt:          { type: Date, default: null },
  failedAt:        { type: Date, default: null },
  failReason:      { type: String, default: null },
  note:            { type: String, default: null },
  processedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
PayoutSchema.index({ seller: 1 });
PayoutSchema.index({ status: 1 });
PayoutSchema.index({ createdAt: -1 });
const Payout = mongoose.model('Payout', PayoutSchema);

// ── AuditLog ──────────────────────────────────────────────────
const AuditLogSchema = new mongoose.Schema({
  actor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  entity: {
    model: { type: String },
    id:    { type: mongoose.Schema.Types.ObjectId },
  },
  before: { type: mongoose.Schema.Types.Mixed, default: null },
  after:  { type: mongoose.Schema.Types.Mixed, default: null },
  ip:     { type: String, default: null },
  ua:     { type: String, default: null },
  note:   { type: String, default: null },
}, { timestamps: true });
AuditLogSchema.index({ actor: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ 'entity.model': 1, 'entity.id': 1 });
AuditLogSchema.index({ createdAt: -1 });
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

// ── Message / Conversation ────────────────────────────────────
const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  order:    { type: mongoose.Schema.Types.ObjectId, ref: 'Order',   default: null },
  lastMessage: {
    text:   { type: String },
    sentAt: { type: Date },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  unreadCount: { type: Map, of: Number, default: {} },
  isArchived:  { type: Boolean, default: false },
}, { timestamps: true });
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ 'lastMessage.sentAt': -1 });
const Conversation = mongoose.model('Conversation', ConversationSchema);

const MessageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:         { type: String, default: null },
  images:       [{ type: String }],
  isRead:       { type: Boolean, default: false },
  readAt:       { type: Date,    default: null },
  isDeleted:    { type: Boolean, default: false },
}, { timestamps: true });
MessageSchema.index({ conversation: 1, createdAt: 1 });
const Message = mongoose.model('Message', MessageSchema);

module.exports = { Coupon, Notification, Payout, AuditLog, Conversation, Message };
