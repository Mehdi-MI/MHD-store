const router = require('express').Router();
const ctrl   = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth');

router.use(protect);  // All cart routes require auth

router.get('/',                    ctrl.getCart);
router.post('/add',                ctrl.addItem);
router.put('/items/:itemId',       ctrl.updateItem);
router.delete('/items/:itemId',    ctrl.removeItem);
router.delete('/',                 ctrl.clearCart);
router.post('/coupon',             ctrl.applyCoupon);
router.delete('/coupon',           ctrl.removeCoupon);

module.exports = router;
