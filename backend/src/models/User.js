const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const AddressSchema = new mongoose.Schema({
  label:       { type: String, default: 'Home' },       // Home, Work, Other
  fullName:    { type: String, required: true },
  phone:       { type: String, required: true },
  country:     { type: String, required: true },
  city:        { type: String, required: true },
  state:       { type: String },
  postalCode:  { type: String, required: true },
  addressLine1:{ type: String, required: true },
  addressLine2:{ type: String },
  isDefault:   { type: Boolean, default: false },
}, { _id: true });

const UserSchema = new mongoose.Schema({
  fullName:   { type: String,  required: true, trim: true },
  email:      { type: String,  required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String,  required: true, minlength: 8, select: false },
  role:       { type: String,  enum: ['customer', 'seller', 'admin'], default: 'customer' },
  avatar:     { type: String,  default: null },         // Cloudinary URL
  phone:      { type: String,  default: null },
  isVerified: { type: Boolean, default: false },
  isActive:   { type: Boolean, default: true },

  // OAuth
  googleId:   { type: String, default: null },
  facebookId: { type: String, default: null },

  // Addresses (embedded)
  addresses:  [AddressSchema],

  // Wishlist (ref to products)
  wishlist:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

  // Password reset
  resetPasswordToken:   { type: String, select: false },
  resetPasswordExpire:  { type: Date,   select: false },

  // Email verification
  verificationToken:    { type: String, select: false },
  verificationExpire:   { type: Date,   select: false },

  // Refresh token
  refreshToken:         { type: String, select: false },

  lastLoginAt: { type: Date },
}, {
  timestamps: true,   // createdAt, updatedAt
});

/* ── Hash password before save ── */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* ── Compare password ── */
UserSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

/* ── Indexes ── */
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', UserSchema);
