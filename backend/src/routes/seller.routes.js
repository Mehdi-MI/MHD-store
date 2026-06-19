const router = require('express').Router();
const ctrl   = require('../controllers/seller.controller');
const { protect, authorizeRoles } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public
router.get('/',    ctrl.getSellers);
router.get('/:id', ctrl.getSeller);

// Seller (authenticated)
router.post('/register',       protect, ctrl.registerSeller);
router.get('/me/profile',      protect, authorizeRoles('seller', 'admin'), ctrl.getMyProfile);
router.put('/me/profile',      protect, authorizeRoles('seller', 'admin'), ctrl.updateMyProfile);
router.post('/me/media/:type', protect, authorizeRoles('seller', 'admin'), upload.single('file'), ctrl.uploadMedia);
router.get('/me/analytics',    protect, authorizeRoles('seller', 'admin'), ctrl.getAnalytics);

// Admin
router.get('/admin/all',       protect, authorizeRoles('admin'), ctrl.adminGetSellers);
router.patch('/:id/status',    protect, authorizeRoles('admin'), ctrl.updateSellerStatus);

module.exports = router;
