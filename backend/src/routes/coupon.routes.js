const router = require('express').Router();
const ctrl   = require('../controllers/coupon.controller');
const { protect, authorizeRoles } = require('../middleware/auth');

// Public — validate a coupon code
router.post('/validate', protect, ctrl.validateCoupon);

// Admin
router.get('/',     protect, authorizeRoles('admin'), ctrl.getCoupons);
router.post('/',    protect, authorizeRoles('admin'), ctrl.createCoupon);
router.put('/:id',  protect, authorizeRoles('admin'), ctrl.updateCoupon);
router.delete('/:id', protect, authorizeRoles('admin'), ctrl.deleteCoupon);

module.exports = router;
