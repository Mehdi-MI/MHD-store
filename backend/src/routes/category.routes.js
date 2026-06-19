const router = require('express').Router();
const ctrl   = require('../controllers/category.controller');
const { protect, authorizeRoles } = require('../middleware/auth');

router.get('/',     ctrl.getCategories);
router.get('/:id',  ctrl.getCategory);

router.post('/',    protect, authorizeRoles('admin'), ctrl.createCategory);
router.put('/:id',  protect, authorizeRoles('admin'), ctrl.updateCategory);
router.delete('/:id', protect, authorizeRoles('admin'), ctrl.deleteCategory);

module.exports = router;
