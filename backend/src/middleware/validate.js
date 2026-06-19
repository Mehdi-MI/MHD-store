const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Run after express-validator chains.
 * Collects all errors and returns 422 if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg).join(', ');
    return next(new AppError(messages, 422));
  }
  next();
};

module.exports = validate;
