const jwt = require('jsonwebtoken');

/**
 * Generate access token (short-lived)
 */
const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

/**
 * Generate refresh token (long-lived)
 */
const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

/**
 * Set JWT cookies on response
 */
const sendTokens = (res, user, statusCode = 200, message = 'Success') => {
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // HttpOnly cookies
  const cookieOptions = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('token', accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,  // 1 day
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
  });

  // Remove sensitive fields
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.resetPasswordToken;
  delete userObj.verificationToken;

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user:  userObj,
      token: accessToken,
    },
  });
};

module.exports = { generateAccessToken, generateRefreshToken, sendTokens };
