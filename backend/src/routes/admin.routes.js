const router = require('express').Router();
const ctrl   = require('../controllers/admin.controller');
const { protect, authorizeRoles } = require('../middleware/auth');

router.use(protect, authorizeRoles('admin'));  // All admin routes locked

router.get('/dashboard',  ctrl.getDashboard);
router.get('/analytics',  ctrl.getAnalytics);

module.exports = router;
