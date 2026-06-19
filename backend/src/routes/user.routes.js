const router = require('express').Router();
const ctrl   = require('../controllers/user.controller');
const { protect, authorizeRoles } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// ── Profile ──────────────────────────────────────────────────
router.get('/profile',    protect, ctrl.getProfile);
router.put('/profile',    protect, ctrl.updateProfile);
router.post('/avatar',    protect, upload.single('avatar'), ctrl.uploadAvatar);

// ── Addresses ─────────────────────────────────────────────────
router.get('/addresses',                  protect, ctrl.getAddresses);
router.post('/addresses',                 protect, ctrl.addAddress);
router.put('/addresses/:addressId',       protect, ctrl.updateAddress);
router.delete('/addresses/:addressId',    protect, ctrl.deleteAddress);

// ── Wishlist ──────────────────────────────────────────────────
router.get('/wishlist',             protect, ctrl.getWishlist);
router.post('/wishlist/:productId', protect, ctrl.toggleWishlist);

// ── Admin ─────────────────────────────────────────────────────
router.get('/',          protect, authorizeRoles('admin'), ctrl.getAllUsers);
router.get('/:id',       protect, authorizeRoles('admin'), ctrl.getUserById);
router.patch('/:id',     protect, authorizeRoles('admin'), ctrl.updateUserStatus);
router.delete('/:id',    protect, authorizeRoles('admin'), ctrl.deleteUser);

module.exports = router;
