const router = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const pwRules = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
  .matches(/[0-9]/).withMessage('Password must contain a number');

router.post('/register',
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  pwRules,
  validate,
  ctrl.register
);

router.post('/login',
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
  ctrl.login
);

router.post('/logout',  ctrl.logout);
router.get('/me',       protect, ctrl.getMe);
router.post('/refresh', ctrl.refresh);
router.post('/forgot-password', body('email').isEmail(), validate, ctrl.forgotPassword);
router.post('/reset-password/:token',
  pwRules, validate,
  ctrl.resetPassword
);
router.put('/change-password',
  protect,
  body('currentPassword').notEmpty(),
  pwRules,
  validate,
  ctrl.changePassword
);

module.exports = router;
