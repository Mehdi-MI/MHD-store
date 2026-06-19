const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product:       { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  seller:        { type: mongoose.Schema.Types.ObjectId, ref: 'Seller',  required: true },
  quantity:      { type: Number, required: true, min: 1, default: 1 },
  selectedSize:  { type: String, default: null },
  selectedColor: { type: String, default: null },
  price:         { type: Number, required: true },   // snapshot at time of add
}, { _id: true, timestamps: true });

const CartSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items:     [CartItemSchema],
  coupon: {
    code:          { type: String,  default: null },
    discountType:  { type: String,  enum: ['percentage', 'fixed', null], default: null },
    discountValue: { type: Number,  default: 0 },
  },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 days
}, {
  timestamps: true,
});

/* ── Virtual: total ── */
CartSchema.virtual('total').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

/* ── Virtual: itemCount ── */
CartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

CartSchema.index({ user: 1 });
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });   // TTL index

module.exports = mongoose.model('Cart', CartSchema);
