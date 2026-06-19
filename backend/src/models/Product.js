const mongoose = require('mongoose');

/* ── Sub-schemas ── */
const VariantSchema = new mongoose.Schema({
  name:    { type: String, required: true },   // e.g. "Size", "Color"
  options: [
    {
      value:  { type: String, required: true },  // e.g. "XL", "Midnight"
      stock:  { type: Number, required: true, min: 0, default: 0 },
      price:  { type: Number, default: null },   // override price if different
      sku:    { type: String, default: null },
    }
  ],
}, { _id: false });

const DimensionSchema = new mongoose.Schema({
  weight: { type: Number, default: null },   // kg
  width:  { type: Number, default: null },   // cm
  height: { type: Number, default: null },   // cm
  depth:  { type: Number, default: null },   // cm
}, { _id: false });

/* ── Main Product schema ── */
const ProductSchema = new mongoose.Schema({
  seller:   { type: mongoose.Schema.Types.ObjectId, ref: 'Seller',   required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  // Core
  name:        { type: String,  required: true, trim: true },
  slug:        { type: String,  required: true, unique: true, lowercase: true },
  description: { type: String,  required: true },
  shortDesc:   { type: String,  maxlength: 200 },

  // Pricing
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: null, min: 0 },   // for sale
  currency:      { type: String, default: 'USD' },

  // Media
  images: [{ type: String }],   // Cloudinary URLs — first is primary

  // Inventory
  stock:        { type: Number, required: true, min: 0, default: 0 },
  sku:          { type: String, default: null, sparse: true },
  trackStock:   { type: Boolean, default: true },
  allowBackorder: { type: Boolean, default: false },

  // Variants (sizes, colors, etc.)
  hasVariants: { type: Boolean, default: false },
  variants:    [VariantSchema],

  // Details & specs
  details: [
    {
      label: { type: String },
      value: { type: String },
    }
  ],

  // Tags & search
  tags:      [{ type: String, lowercase: true }],
  badge:     { type: String, enum: ['New', 'Sale', 'Bestseller', 'Limited', null], default: null },

  // Ratings (denormalized)
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },

  // Shipping
  shipping: {
    isFreeShipping: { type: Boolean, default: false },
    weight:         { type: Number, default: null },
    dimensions:     DimensionSchema,
    shipsFrom:      { type: String, default: null },
    processingDays: { type: Number, default: 2 },
  },

  // Status
  status:     { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' },
  isFeatured: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },   // Admin must approve

  // SEO
  seo: {
    metaTitle:       { type: String, default: null },
    metaDescription: { type: String, default: null },
  },

  // Stats
  viewCount:    { type: Number, default: 0 },
  salesCount:   { type: Number, default: 0 },

}, {
  timestamps: true,
});

/* ── Indexes ── */
ProductSchema.index({ seller: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });  // Full-text search

module.exports = mongoose.model('Product', ProductSchema);
