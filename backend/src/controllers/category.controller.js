const { Category } = require('../models');
const AppError   = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// ── Get all categories (public) ───────────────────────────────
exports.getCategories = catchAsync(async (req, res) => {
  const filter = {};
  if (!req.query.all) filter.isActive = true;

  const categories = await Category.find(filter)
    .sort('sortOrder name')
    .populate('parent', 'name slug');

  res.json({ success: true, data: categories });
});

// ── Get single category ───────────────────────────────────────
exports.getCategory = catchAsync(async (req, res, next) => {
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.id }
    : { slug: req.params.id };

  const category = await Category.findOne(query).populate('parent', 'name slug');
  if (!category) return next(new AppError('Category not found.', 404));

  res.json({ success: true, data: category });
});

// ── Admin: create category ────────────────────────────────────
exports.createCategory = catchAsync(async (req, res, next) => {
  // Auto-generate slug
  if (!req.body.slug) {
    req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const category = await Category.create(req.body);
  res.status(201).json({ success: true, message: 'Category created', data: category });
});

// ── Admin: update category ────────────────────────────────────
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!category) return next(new AppError('Category not found.', 404));
  res.json({ success: true, message: 'Category updated', data: category });
});

// ── Admin: delete category ────────────────────────────────────
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError('Category not found.', 404));
  if (category.productCount > 0) {
    return next(new AppError('Cannot delete a category that has products.', 400));
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});
