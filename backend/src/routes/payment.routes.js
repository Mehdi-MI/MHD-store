const router = require('express').Router();
const ctrl   = require('../controllers/payment.controller');
const { protect, authorizeRoles } = require('../middleware/auth');

// Stripe webhook — must be BEFORE express.json() in app.js (raw body)
router.post('/webhook', ctrl.stripeWebhook);

// Authenticated
router.post('/create-intent',        protect, ctrl.createPaymentIntent);
router.get('/order/:orderId',        protect, ctrl.getPaymentByOrder);

// Admin
router.post('/:paymentId/refund',    protect, authorizeRoles('admin'), ctrl.refundPayment);

module.exports = router;
