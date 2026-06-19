const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // Store identity
  storeName:   { type: String, required: true, trim: true },
  storeSlug:   { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true, maxlength: 500 },
  logo:        { type: String, default: null },          // Cloudinary URL
  banner:      { type: String, default: null },          // Cloudinary URL
  category:    { type: String, required: true },

  // Contact
  phone:       { type: String, required: true },
  email:       { type: String, required: true },
  website:     { type: String, default: null },

  // Location
  country:     { type: String, required: true },
  city:        { type: String, required: true },
  address:     { type: String, default: null },

  // Social links
  socials: {
    instagram: { type: String, default: null },
    twitter:   { type: String, default: null },
    facebook:  { type: String, default: null },
  },

  // Status
  status: {
    type:    String,
    enum:    ['pending', 'approved', 'suspended', 'rejected'],
    default: 'pending',
  },
  rejectionReason: { type: String, default: null },
  approvedAt:      { type: Date,   default: null },
  suspendedAt:     { type: Date,   default: null },

  // Metrics (denormalized for perf)
  metrics: {
    totalProducts:  { type: Number, default: 0 },
    totalOrders:    { type: Number, default: 0 },
    totalRevenue:   { type: Number, default: 0 },
    averageRating:  { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:    { type: Number, default: 0 },
  },

  // Payout / bank info
  payout: {
    method:        { type: String, enum: ['stripe', 'paypal', 'bank'], default: 'stripe' },
    stripeAccountId: { type: String, default: null, select: false },
    paypalEmail:   { type: String, default: null, select: false },
    bankDetails:   { type: String, default: null, select: false }, // encrypted
  },

  // Commission rate (default 8%)
  commissionRate: { type: Number, default: 8, min: 0, max: 30 },

}, {
  timestamps: true,
});

/* ── Indexes ── */
SellerSchema.index({ storeSlug: 1 });
SellerSchema.index({ user: 1 });
SellerSchema.index({ status: 1 });
SellerSchema.index({ category: 1 });
SellerSchema.index({ 'metrics.averageRating': -1 });
SellerSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Seller', SellerSchema);
