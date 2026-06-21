const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/response');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/forgot-password attempts per window
  handler: (req, res) => {
    res.status(429).json(
      errorResponse('Too many authentication attempts. Please try again in 15 minutes.')
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter };
