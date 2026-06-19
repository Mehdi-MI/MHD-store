const { Product, Category, Seller } = require('../models');
const AppError   = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/APIFeatures');
const { uploadToCloudinary } = require('../middleware/upload');

// ── Get all products (public) ─────────────────────────────────
exports.getProducts = catchAsync(async (req, res) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip  = (page - 1) * limit;

  // Build filter
  const filter = { status: 'active', isApproved: true };

  if (req.query.category) {
    const cat = await Category.findOne({ slug: req.query.category });
    if (cat) filter.category = cat._id;
  }
  if (req.query.seller)   filter.seller = req.query.seller;
  if (req.query.badge)    filter.badge  = req.query.badge;
  if (req.query.featured) filter.isFeatured = true;

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.rating) filter.rating = { $gte: Number(req.query.rating) };

  // Full-text search
  if (req.query.q || req.query.search) {
    const term = req.query.q || req.query.search;
    filter.$or = [
      { name: new RegExp(term, 'i') },
      { tags: new RegExp(term, 'i') },
    ];
  }

  // Sort
  const sortMap = {
    newest:     '-createdAt',
    price_asc:  'price',
    price_desc: '-price',
    popular:    '-salesCount',
    rating:     '-rating',
  };
  const sort = sortMap[req.query.sort] || '-createdAt';

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('seller',   'storeName storeSlug logo')
      .populate('category', 'name slug')
      .select('-__v'),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { products, total, page, pages: Math.ceil(total / limit) },
  });
});

// ── Get single product ────────────────────────────────────────
exports.getProduct = catchAsync(async (req, res, next) => {
  // Accept both id and slug
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.id }
    : { slug: req.params.id };

  const product = await Product.findOne(query)
    .populate('seller',   'storeName storeSlug logo status metrics')
    .populate('category', 'name slug');

  if (!product) return next(new AppError('Product not found.', 404));

  // Increment view count (fire and forget)
  Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } }).exec();

  res.json({ success: true, data: product });
});

// ── Create product (seller) ───────────────────────────────────
exports.createProduct = catchAsync(async (req, res, next) => {
  // Find seller profile for this user
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) return next(new AppError('Seller profile not found.', 404));
  if (seller.status !== 'approved') {
    return next(new AppError('Your store must be approved to list products.', 403));
  }

  // Validate category
  const category = await Category.findById(req.body.category);
  if (!category) return next(new AppError('Category not found.', 404));

  // Generate slug from name if not provided
  if (!req.body.slug) {
    req.body.slug = req.body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Ensure slug is unique
  const existing = await Product.findOne({ slug: req.body.slug });
  if (existing) {
    req.body.slug = `${req.body.slug}-${Date.now()}`;
  }

  const product = await Product.create({
    ...req.body,
    seller: seller._id,
  });

  // Update category product count
  await Category.findByIdAndUpdate(category._id, { $inc: { productCount: 1 } });
  // Update seller metrics
  await Seller.findByIdAndUpdate(seller._id, { $inc: { 'metrics.totalProducts': 1 } });

  await product.populate(['seller', 'category']);

  res.status(201).json({ success: true, message: 'Product created', data: product });
});

// ── Update product (seller owns it or admin) ──────────────────
exports.updateProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found.', 404));

  // Ownership check
  if (req.user.role !== 'admin') {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller || !product.seller.equals(seller._id)) {
      return next(new AppError('Not authorized to update this product.', 403));
    }
  }

  // Prevent direct approval bypass
  if (req.user.role !== 'admin') delete req.body.isApproved;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  }).populate('seller category');

  res.json({ success: true, message: 'Product updated', data: product });
});

// ── Delete product ────────────────────────────────────────────
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found.', 404));

  if (req.user.role !== 'admin') {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller || !product.seller.equals(seller._id)) {
      return next(new AppError('Not authorized to delete this product.', 403));
    }
  }

  await product.deleteOne();

  // Update counters
  await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
  await Seller.findByIdAndUpdate(product.seller, { $inc: { 'metrics.totalProducts': -1 } });

  res.json({ success: true, message: 'Product deleted' });
});

// ── Upload product images ─────────────────────────────────────
exports.uploadImages = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found.', 404));

  if (!req.files || req.files.length === 0) {
    return next(new AppError('No files uploaded.', 400));
  }

  const uploadPromises = req.files.map(f => uploadToCloudinary(f.buffer, 'products'));
  const results = await Promise.all(uploadPromises);
  const urls    = results.map(r => r.url);

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { $each: urls } } },
    { new: true }
  );

  res.json({ success: true, message: 'Images uploaded', data: { images: updated.images } });
});

// ── Get seller's own products ─────────────────────────────────
exports.getMyProducts = catchAsync(async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) return next(new AppError('Seller profile not found.', 404));

  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip  = (page - 1) * limit;

  const filter = { seller: seller._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) filter.name = new RegExp(req.query.search, 'i');

  const [products, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).sort('-createdAt').populate('category', 'name slug'),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { products, total, page, pages: Math.ceil(total / limit) },
  });
});

// ── Admin: approve / reject product ──────────────────────────
exports.approveProduct = catchAsync(async (req, res, next) => {
  const { isApproved } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isApproved, status: isApproved ? 'active' : 'draft' },
    { new: true }
  );
  if (!product) return next(new AppError('Product not found.', 404));
  res.json({ success: true, message: `Product ${isApproved ? 'approved' : 'rejected'}`, data: product });
});

// ── Get products by category slug ────────────────────────────
exports.getByCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) return next(new AppError('Category not found.', 404));

  req.query.category = req.params.slug;
  return exports.getProducts(req, res, next);
});
