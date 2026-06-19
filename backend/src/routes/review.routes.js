const router = require('express').Router();
const ctrl   = require('../controllers/review.controller');
const { protect, authorizeRoles } = require('../middleware/auth');

// Public
router.get('/product/:productId', ctrl.getProductReviews);

// Customer
router.post('/',              protect, ctrl.createReview);
router.put('/:id',            protect, ctrl.updateReview);
router.delete('/:id',         protect, ctrl.deleteReview);
router.post('/:id/helpful',   protect, ctrl.markHelpful);

// Seller
router.post('/:id/reply',     protect, authorizeRoles('seller', 'admin'), ctrl.sellerReply);

// Admin
router.get('/',               protect, authorizeRoles('admin'), ctrl.adminGetReviews);
router.patch('/:id/moderate', protect, authorizeRoles('admin'), ctrl.moderateReview);

module.exports = router;
