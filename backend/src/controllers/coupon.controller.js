const { Coupon } = require('../models');
const AppError   = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// ── Validate a coupon code (public check) ─────────────────────
exports.validateCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    code:     req.body.code?.toUpperCase(),
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  });

  if (!coupon) return next(new AppError('Invalid or expired coupon.', 400));

  if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
    return next(new AppError('Coupon usage limit reached.', 400));
  }

  res.json({
    success: true,
    data: {
      code:          coupon.code,
      discountType:  coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount:coupon.minOrderAmount,
      description:   coupon.description,
    },
  });
});

// ── Admin: list all coupons ───────────────────────────────────
exports.getCoupons = catchAsync(async (req, res) => {
  const coupons = await Coupon.find()
    .sort('-createdAt')
    .select('-usageLog')
    .populate('createdBy', 'fullName');
  res.json({ success: true, data: coupons });
});

// ── Admin: create coupon ──────────────────────────────────────
exports.createCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
});

// ── Admin: update coupon ──────────────────────────────────────
exports.updateCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!coupon) return next(new AppError('Coupon not found.', 404));
  res.json({ success: true, message: 'Coupon updated', data: coupon });
});

// ── Admin: delete coupon ──────────────────────────────────────
exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return next(new AppError('Coupon not found.', 404));
  res.json({ success: true, message: 'Coupon deleted' });
});
