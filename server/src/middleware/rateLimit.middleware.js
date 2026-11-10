const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV !== 'production';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 200 : 25,
  message: { success: false, message: 'Too many auth attempts, please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const recommendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isDev ? 200 : 40,
  message: { success: false, message: 'Recommendation generation limit reached. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, recommendLimiter };
