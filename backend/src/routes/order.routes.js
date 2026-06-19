const router = require('express').Router();
const ctrl   = require('../controllers/order.controller');
const { protect, authorizeRoles } = require('../middleware/auth');

// Customer
router.post('/',        protect, ctrl.createOrder);
router.get('/me',       protect, ctrl.getMyOrders);
router.get('/:id',      protect, ctrl.getOrder);
router.patch('/:id/cancel', protect, ctrl.cancelOrder);

// Seller
router.get('/seller/all',    protect, authorizeRoles('seller', 'admin'), ctrl.getSellerOrders);
router.patch('/:id/status',  protect, authorizeRoles('seller', 'admin'), ctrl.updateOrderStatus);

// Admin
router.get('/',              protect, authorizeRoles('admin'), ctrl.adminGetOrders);

module.exports = router;
