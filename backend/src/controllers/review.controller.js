const { Review, Order, Product, Seller } = require('../models');
const AppError   = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { notify } = require('../utils/notification');

// ── Get reviews for a product ─────────────────────────────────
exports.getProductReviews = catchAsync(async (req, res, next) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip  = (page - 1) * limit;

  const product = await Product.findById(req.params.productId);
  if (!product) return next(new AppError('Product not found.', 404));

  const filter = {
    product:    req.params.productId,
    isApproved: true,
    isHidden:   false,
  };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort('-createdAt').skip(skip).limit(limit)
      .populate('user', 'fullName avatar'),
    Review.countDocuments(filter),
  ]);

  res.json({ success: true, data: { reviews, total, page, pages: Math.ceil(total / limit) } });
});

// ── Create review ─────────────────────────────────────────────
exports.createReview = catchAsync(async (req, res, next) => {
  const { productId, orderId, rating, title, comment } = req.body;

  // Verify purchase
  const order = await Order.findOne({
    _id:           orderId,
    user:          req.user._id,
    'items.product': productId,
    orderStatus:   'delivered',
  });
  if (!order) {
    return next(new AppError('You can only review products from delivered orders.', 403));
  }

  // Check duplicate
  const existing = await Review.findOne({ product: productId, user: req.user._id, order: orderId });
  if (existing) return next(new AppError('You have already reviewed this product.', 409));

  // Find seller for this item
  const orderItem = order.items.find(i => i.product.toString() === productId);

  const review = await Review.create({
    product:    productId,
    user:       req.user._id,
    seller:     orderItem.seller,
    order:      orderId,
    rating,
    title,
    comment,
  });

  // Notify seller
  notify.reviewReceived(orderItem.seller, orderItem.name);

  await review.populate('user', 'fullName avatar');

  res.status(201).json({ success: true, message: 'Review submitted', data: review });
});

// ── Update review ─────────────────────────────────────────────
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found.', 404));
  if (!review.user.equals(req.user._id)) return next(new AppError('Not authorized.', 403));

  const { rating, title, comment } = req.body;
  if (rating)  review.rating  = rating;
  if (title)   review.title   = title;
  if (comment) review.comment = comment;

  await review.save();

  res.json({ success: true, message: 'Review updated', data: review });
});

// ── Delete review ─────────────────────────────────────────────
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found.', 404));

  const isOwner = review.user.equals(req.user._id);
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) return next(new AppError('Not authorized.', 403));

  await review.deleteOne();

  res.json({ success: true, message: 'Review deleted' });
});

// ── Seller reply to review ────────────────────────────────────
exports.sellerReply = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found.', 404));

  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller || !review.seller.equals(seller._id)) {
    return next(new AppError('Not authorized to reply to this review.', 403));
  }

  review.sellerReply = { comment: req.body.comment, repliedAt: new Date() };
  await review.save();

  res.json({ success: true, message: 'Reply added', data: review });
});

// ── Mark review as helpful ────────────────────────────────────
exports.markHelpful = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found.', 404));

  const idx = review.helpfulVotes.indexOf(req.user._id);
  if (idx >= 0) {
    review.helpfulVotes.splice(idx, 1);
    review.helpfulCount = Math.max(0, review.helpfulCount - 1);
  } else {
    review.helpfulVotes.push(req.user._id);
    review.helpfulCount += 1;
  }

  await review.save();
  res.json({ success: true, data: { helpfulCount: review.helpfulCount } });
});

// ── Admin: moderate review ────────────────────────────────────
exports.moderateReview = catchAsync(async (req, res, next) => {
  const { isApproved, isHidden, hiddenReason } = req.body;
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved, isHidden, hiddenReason },
    { new: true }
  );
  if (!review) return next(new AppError('Review not found.', 404));
  res.json({ success: true, message: 'Review moderated', data: review });
});

// ── Admin: get all reviews ────────────────────────────────────
exports.adminGetReviews = catchAsync(async (req, res) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.status === 'flagged') filter.isHidden = true;
  if (req.query.status === 'approved') { filter.isApproved = true; filter.isHidden = false; }
  if (req.query.search) filter.comment = new RegExp(req.query.search, 'i');

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort('-createdAt').skip(skip).limit(limit)
      .populate('user',    'fullName avatar')
      .populate('product', 'name images')
      .populate('seller',  'storeName'),
    Review.countDocuments(filter),
  ]);

  res.json({ success: true, data: { reviews, total, page, pages: Math.ceil(total / limit) } });
});
