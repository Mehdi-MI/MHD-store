const router = require('express').Router();
const ctrl   = require('../controllers/product.controller');
const { protect, authorizeRoles, optionalAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/',                    optionalAuth, ctrl.getProducts);
router.get('/category/:slug',      ctrl.getByCategory);
router.get('/:id',                 optionalAuth, ctrl.getProduct);

// Seller routes
router.get('/seller/me',           protect, authorizeRoles('seller', 'admin'), ctrl.getMyProducts);
router.post('/',                   protect, authorizeRoles('seller', 'admin'), ctrl.createProduct);
router.put('/:id',                 protect, authorizeRoles('seller', 'admin'), ctrl.updateProduct);
router.delete('/:id',              protect, authorizeRoles('seller', 'admin'), ctrl.deleteProduct);
router.post('/:id/images',         protect, authorizeRoles('seller', 'admin'), upload.array('images', 8), ctrl.uploadImages);

// Admin routes
router.patch('/:id/approve',       protect, authorizeRoles('admin'), ctrl.approveProduct);

module.exports = router;
