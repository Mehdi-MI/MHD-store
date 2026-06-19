const { User, Order, Product, Seller, Review } = require('../models');
const catchAsync = require('../utils/catchAsync');

// ── Platform dashboard stats ──────────────────────────────────
exports.getDashboard = catchAsync(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalSellers,
    totalProducts,
    totalOrders,
    revenueAgg,
    pendingSellers,
    pendingProducts,
    recentOrders,
    recentUsers,
    revenueByMonth,
    ordersByStatus,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Seller.countDocuments({ status: 'approved' }),
    Product.countDocuments({ status: 'active', isApproved: true }),
    Order.countDocuments(),

    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' }, commission: { $sum: { $multiply: ['$total', 0.08] } } } },
    ]),

    Seller.countDocuments({ status: 'pending' }),
    Product.countDocuments({ status: 'active', isApproved: false }),

    Order.find().sort('-createdAt').limit(10)
      .populate('user', 'fullName email')
      .select('orderNumber orderStatus total user createdAt'),

    User.find().sort('-createdAt').limit(10)
      .select('fullName email role createdAt'),

    // Revenue by month (last 8 months)
    Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id:     { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders:  { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
      { $project: { month: '$_id', revenue: 1, orders: 1 } },
    ]),

    Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]),
  ]);

  const totalRevenue    = revenueAgg[0]?.total      || 0;
  const totalCommission = revenueAgg[0]?.commission  || 0;
  const avgOrderValue   = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCommission,
        avgOrderValue,
        pendingSellers,
        pendingProducts,
      },
      revenueByMonth,
      ordersByStatus,
      recentOrders,
      recentUsers,
    },
  });
});

// ── Platform revenue analytics ────────────────────────────────
exports.getAnalytics = catchAsync(async (req, res) => {
  const days  = parseInt(req.query.days, 10) || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [revenueOverTime, topSellers, topProducts, userGrowth] = await Promise.all([
    Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: since } } },
      {
        $group: {
          _id:        { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue:    { $sum: '$total' },
          commission: { $sum: { $multiply: ['$total', 0.08] } },
          orders:     { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]),

    Seller.find({ status: 'approved' })
      .sort('-metrics.totalRevenue')
      .limit(10)
      .select('storeName metrics commissionRate'),

    Product.find({ status: 'active', isApproved: true })
      .sort('-salesCount')
      .limit(10)
      .select('name price salesCount rating images')
      .populate('seller', 'storeName'),

    User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id:   { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]),
  ]);

  res.json({
    success: true,
    data: { revenueOverTime, topSellers, topProducts, userGrowth },
  });
});
