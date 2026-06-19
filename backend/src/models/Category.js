const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: null },
  image:       { type: String, default: null },   // Cloudinary URL
  icon:        { type: String, default: null },   // SVG string or icon key
  parent:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive:    { type: Boolean, default: true },
  sortOrder:   { type: Number,  default: 0 },

  // Denormalized counter
  productCount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ isActive: 1 });

module.exports = mongoose.model('Category', CategorySchema);
