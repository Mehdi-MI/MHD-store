const jwt        = require('jsonwebtoken');
const { User }   = require('../models');
const AppError   = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * protect — verifies JWT and attaches req.user
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  // Check Authorization header first, then cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Not authenticated. Please log in.', 401));
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Fetch user — exclude password
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return next(new AppError('User no longer exists.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Contact support.', 403));
  }

  req.user = user;
  next();
});

/**
 * authorizeRoles — restrict access to specific roles
 * Usage: authorizeRoles('admin', 'seller')
 */
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(`Role '${req.user.role}' is not authorized for this action.`, 403)
    );
  }
  next();
};

/**
 * optionalAuth — attach user if token present, but don't block if not
 */
const optionalAuth = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // invalid token → just skip
    }
  }

  next();
});

module.exports = { protect, authorizeRoles, optionalAuth };
