const crypto     = require('crypto');
const jwt        = require('jsonwebtoken');
const { User }   = require('../models');
const AppError   = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendTokens, generateAccessToken } = require('../utils/jwt');
const sendEmail  = require('../config/email');

// ── Register ─────────────────────────────────────────────────
exports.register = catchAsync(async (req, res, next) => {
  const { fullName, email, password, role } = req.body;

  // Prevent self-elevation to admin
  const safeRole = role === 'admin' ? 'customer' : (role || 'customer');

  const existing = await User.findOne({ email });
  if (existing) return next(new AppError('Email already registered.', 409));

  const user = await User.create({ fullName, email, password, role: safeRole });

  // Send welcome email (non-blocking)
  sendEmail({
    to:      email,
    subject: 'Welcome to MHD Store',
    html:    `<h2>Welcome, ${fullName}!</h2><p>Your account has been created successfully.</p>`,
  }).catch(console.error);

  sendTokens(res, user, 201, 'Account created successfully');
});

// ── Login ─────────────────────────────────────────────────────
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated.', 403));
  }

  user.lastLoginAt = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokens(res, user, 200, 'Logged in successfully');
});

// ── Logout ────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.cookie('token',        '', { httpOnly: true, expires: new Date(0) });
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out successfully' });
};

// ── Get current user ──────────────────────────────────────────
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

// ── Refresh access token ──────────────────────────────────────
exports.refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!refreshToken) return next(new AppError('No refresh token provided.', 401));

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) return next(new AppError('Invalid refresh token.', 401));

  const newAccessToken = generateAccessToken(user._id);

  res.cookie('token', newAccessToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   24 * 60 * 60 * 1000,
  });

  res.json({ success: true, data: { token: newAccessToken } });
});

// ── Forgot password ───────────────────────────────────────────
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // Always respond OK to prevent email enumeration
  if (!user) {
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;  // 10 min
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to:      user.email,
    subject: 'Password Reset Request — MHD Store',
    html:    `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. This link expires in 10 minutes.</p>
      <a href="${resetUrl}" style="background:#C9A84C;color:#000;padding:12px 24px;text-decoration:none;display:inline-block;">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });

  res.json({ success: true, message: 'Password reset link sent to your email.' });
});

// ── Reset password ────────────────────────────────────────────
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken:  hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired.', 400));

  user.password             = req.body.password;
  user.resetPasswordToken   = undefined;
  user.resetPasswordExpire  = undefined;
  await user.save();

  sendTokens(res, user, 200, 'Password reset successfully');
});

// ── Change password (authenticated) ──────────────────────────
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  await user.save();

  sendTokens(res, user, 200, 'Password changed successfully');
});
