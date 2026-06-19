const { Seller, User, Product, Order } = require('../models');
const AppError   = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { notify } = require('../utils/notification');
const { uploadToCloudinary } = require('../middleware/upload');

// ── Register as seller ────────────────────────────────────────
exports.registerSeller = catchAsync(async (req, res, next) => {
  const existingSeller = await Seller.findOne({ user: req.user._id });
  if (existingSeller) return next(new AppError('You already have a seller account.', 409));

  // Auto-generate slug from store name
  let slug = req.body.storeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const slugExists = await Seller.findOne({ storeSlug: slug });
  if (slugExists) slug = `${slug}-${Date.now()}`;

  const seller = await Seller.create({
    ...req.body,
    user:      req.user._id,
    storeSlug: req.body.storeSlug || slug,
    email:     req.body.email || req.user.email,
  });

  // Update user role to seller
  await User.findByIdAndUpdate(req.user._id, { role: 'seller' });

  res.status(201).json({
    success: true,
    message: 'Seller application submitted. You will be notified once approved.',
    data:    seller,
  });
});

// ── Get all sellers (public) ──────────────────────────────────
exports.getSellers = catchAsync(async (req, res) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip  = (page - 1) * limit;

  const filter = { status: 'approved' };
  if (req.query.category) filter.category = new RegExp(req.query.category, 'i');
  if (req.query.search)   filter.storeName = new RegExp(req.query.search, 'i');

  const [sellers, total] = await Promise.all([
    Seller.find(filter)
      .skip(skip).limit(limit)
      .sort('-metrics.totalRevenue')
      .select('-payout'),
    Seller.countDocuments(filter),
  ]);

  res.json({ success: true, data: { sellers, total, page, pages: Math.ceil(total / limit) } });
});

// ── Get single seller by id or slug ──────────────────────────
exports.getSeller = catchAsync(async (req, res, next) => {
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.id }
    : { storeSlug: req.params.id };

  const seller = await Seller.findOne(query)
    .populate('user', 'fullName avatar')
    .select('-payout');
  if (!seller) return next(new AppError('Seller not found.', 404));

  res.json({ success: true, data: seller });
});

// ── Get my seller profile ─────────────────────────────────────
exports.getMyProfile = catchAsync(async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id }).populate('user', 'fullName avatar email');
  if (!seller) return next(new AppError('Seller profile not found.', 404));
  res.json({ success: true, data: seller });
});

// ── Update seller profile ─────────────────────────────────────
exports.updateMyProfile = catchAsync(async (req, res, next) => {
  // Prevent status/commissionRate changes by seller
  const { status, commissionRate, user, ...safeBody } = req.body;

  const seller = await Seller.findOneAndUpdate(
    { user: req.user._id },
    safeBody,
    { new: true, runValidators: true }
  );
  if (!seller) return next(new AppError('Seller profile not found.', 404));

  res.json({ success: true, message: 'Profile updated', data: seller });
});

// ── Upload seller logo/banner ─────────────────────────────────
exports.uploadMedia = catchAsync(async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) return next(new AppError('Seller profile not found.', 404));
  if (!req.file) return next(new AppError('No file uploaded.', 400));

  const field  = req.params.type === 'banner' ? 'banner' : 'logo';
  const folder = `sellers/${field}s`;
  const { url } = await uploadToCloudinary(req.file.buffer, folder);

  const updated = await Seller.findByIdAndUpdate(
    seller._id,
    { [field]: url },
    { new: true }
  );

  res.json({ success: true, message: `${field} updated`, data: { [field]: updated[field] } });
});

// ── Seller analytics ──────────────────────────────────────────
exports.getAnalytics = catchAsync(async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) return next(new AppError('Seller profile not found.', 404));

  const days  = parseInt(req.query.days, 10) || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [revenueByMonth, topProducts, recentOrders] = await Promise.all([
    // Revenue aggregation by month
    Order.aggregate([
      {
        $match: {
          'items.seller': seller._id,
          paymentStatus: 'paid',
          createdAt:     { $gte: since },
        },
      },
      { $unwind: '$items' },
      { $match: { 'items.seller': seller._id } },
      {
        $group: {
          _id:     { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$items.subtotal' },
          orders:  { $addToSet: '$_id' },
        },
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          month:   '$_id',
          revenue: 1,
          orders:  { $size: '$orders' },
        },
      },
    ]),

    // Top selling products
    Order.aggregate([
      { $match: { 'items.seller': seller._id, paymentStatus: 'paid' } },
      { $unwind: '$items' },
      { $match: { 'items.seller': seller._id } },
      {
        $group: {
          _id:     '$items.product',
          name:    { $first: '$items.name' },
          sales:   { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]),

    // Recent orders
    Order.find({ 'items.seller': seller._id })
      .sort('-createdAt')
      .limit(10)
      .select('orderNumber user orderStatus total createdAt'),
  ]);

  res.json({
    success: true,
    data: {
      metrics:       seller.metrics,
      revenueByMonth,
      topProducts,
      recentOrders,
    },
  });
});

// ── Admin: get all sellers ────────────────────────────────────
exports.adminGetSellers = catchAsync(async (req, res) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) filter.storeName = new RegExp(req.query.search, 'i');

  const [sellers, total] = await Promise.all([
    Seller.find(filter)
      .skip(skip).limit(limit)
      .sort('-createdAt')
      .populate('user', 'fullName email')
      .select('-payout'),
    Seller.countDocuments(filter),
  ]);

  res.json({ success: true, data: { sellers, total, page, pages: Math.ceil(total / limit) } });
});

// ── Admin: approve / reject / suspend seller ──────────────────
exports.updateSellerStatus = catchAsync(async (req, res, next) => {
  const { status, rejectionReason } = req.body;
  const validStatuses = ['approved', 'rejected', 'suspended', 'pending'];
  if (!validStatuses.includes(status)) return next(new AppError('Invalid status.', 400));

  const seller = await Seller.findByIdAndUpdate(
    req.params.id,
    {
      status,
      rejectionReason: status === 'rejected' ? rejectionReason : null,
      approvedAt:      status === 'approved'  ? new Date() : undefined,
      suspendedAt:     status === 'suspended' ? new Date() : undefined,
    },
    { new: true }
  ).populate('user', '_id');

  if (!seller) return next(new AppError('Seller not found.', 404));

  // Send notification
  if (status === 'approved')  notify.sellerApproved(seller.user._id);
  if (status === 'rejected')  notify.sellerRejected(seller.user._id, rejectionReason);

  res.json({ success: true, message: `Seller ${status}`, data: seller });
});
