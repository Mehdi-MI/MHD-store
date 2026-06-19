const { User, Product } = require('../models');
const AppError          = require('../utils/AppError');
const catchAsync        = require('../utils/catchAsync');
const { uploadToCloudinary } = require('../middleware/upload');

// ── Get profile ───────────────────────────────────────────────
exports.getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price rating');
  res.json({ success: true, data: user });
});

// ── Update profile ────────────────────────────────────────────
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { fullName, phone, preferences, notifications } = req.body;

  // Don't allow role/email changes here
  const updates = {};
  if (fullName)      updates.fullName = fullName;
  if (phone)         updates.phone    = phone;
  if (preferences)   updates.preferences   = { ...req.user.preferences,   ...preferences };
  if (notifications) updates.notifications = { ...req.user.notifications, ...notifications };

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true, runValidators: true,
  });

  res.json({ success: true, message: 'Profile updated', data: user });
});

// ── Upload avatar ─────────────────────────────────────────────
exports.uploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded.', 400));

  const { url } = await uploadToCloudinary(req.file.buffer, 'avatars');

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: url },
    { new: true }
  );

  res.json({ success: true, message: 'Avatar updated', data: { avatar: user.avatar } });
});

// ── Addresses ─────────────────────────────────────────────────
exports.getAddresses = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('addresses');
  res.json({ success: true, data: user.addresses });
});

exports.addAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);

  // If first address or flagged as default — reset others
  if (req.body.isDefault || user.addresses.length === 0) {
    user.addresses.forEach(a => { a.isDefault = false; });
    req.body.isDefault = true;
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({ success: true, message: 'Address added', data: user.addresses });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const user    = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) return next(new AppError('Address not found.', 404));

  if (req.body.isDefault) {
    user.addresses.forEach(a => { a.isDefault = false; });
  }

  Object.assign(address, req.body);
  await user.save();

  res.json({ success: true, message: 'Address updated', data: user.addresses });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const user    = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) return next(new AppError('Address not found.', 404));

  address.deleteOne();
  await user.save();

  res.json({ success: true, message: 'Address removed', data: user.addresses });
});

// ── Wishlist ──────────────────────────────────────────────────
exports.getWishlist = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    select: 'name images price originalPrice rating reviewCount seller badge',
    populate: { path: 'seller', select: 'storeName storeSlug' },
  });
  res.json({ success: true, data: user.wishlist });
});

exports.toggleWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found.', 404));

  const user = await User.findById(req.user._id);
  const idx  = user.wishlist.indexOf(productId);

  let action;
  if (idx >= 0) {
    user.wishlist.splice(idx, 1);
    action = 'removed';
  } else {
    user.wishlist.push(productId);
    action = 'added';
  }

  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`,
    data:    { wishlisted: action === 'added' },
  });
});

// ── Admin: list all users ─────────────────────────────────────
exports.getAllUsers = catchAsync(async (req, res) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.role)   filter.role     = req.query.role;
  if (req.query.status === 'banned') filter.isActive = false;
  if (req.query.search) {
    const r = new RegExp(req.query.search, 'i');
    filter.$or = [{ fullName: r }, { email: r }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).sort('-createdAt').select('-password'),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { users, total, page, pages: Math.ceil(total / limit) },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return next(new AppError('User not found.', 404));
  res.json({ success: true, data: user });
});

exports.updateUserStatus = catchAsync(async (req, res, next) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  ).select('-password');
  if (!user) return next(new AppError('User not found.', 404));
  res.json({ success: true, message: `User ${isActive ? 'activated' : 'banned'}`, data: user });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));
  if (user.role === 'admin') return next(new AppError('Cannot delete admin users.', 403));
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});
