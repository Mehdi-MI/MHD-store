const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  seller:   { type: mongoose.Schema.Types.ObjectId, ref: 'Seller',  required: true },
  order:    { type: mongoose.Schema.Types.ObjectId, ref: 'Order',   required: true },

  rating:   { type: Number, required: true, min: 1, max: 5 },
  title:    { type: String, default: null, maxlength: 100 },
  comment:  { type: String, required: true, maxlength: 1000 },
  images:   [{ type: String }],   // Cloudinary URLs

  // Seller reply
  sellerReply: {
    comment:   { type: String, default: null },
    repliedAt: { type: Date,   default: null },
  },

  // Moderation
  isVerified:  { type: Boolean, default: true },   // purchased the product
  isApproved:  { type: Boolean, default: true },
  isHidden:    { type: Boolean, default: false },
  hiddenReason:{ type: String,  default: null },

  // Helpful votes
  helpfulVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  helpfulCount: { type: Number, default: 0 },

}, {
  timestamps: true,
});

/* ── One review per user per product per order ── */
ReviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });
ReviewSchema.index({ product: 1 });
ReviewSchema.index({ seller: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ createdAt: -1 });

/* ── Update product rating after save ── */
ReviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { product: this.product, isApproved: true, isHidden: false } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      rating:      Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
