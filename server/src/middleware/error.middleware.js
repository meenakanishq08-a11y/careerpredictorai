const { error: apiError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('[ErrorHandler]', err.message);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return apiError(res, `${field} already exists`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return apiError(res, messages.join(', '), 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return apiError(res, 'Invalid token', 401);
  }

  return apiError(res, err.message || 'Server error', err.statusCode || 500);
};

module.exports = errorHandler;
