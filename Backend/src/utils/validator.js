const { body } = require('express-validator');

const registerRules = [
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const bookingRules = [
  body('booking_type').isIn(['city_ride', 'intercity', 'package']).withMessage('Invalid booking type'),
  body('total_fare').isFloat({ min: 0 }).withMessage('Total fare must be a positive number'),
  body('pickup_location').trim().notEmpty().withMessage('Pickup location is required'),
  body('dropoff_location').trim().notEmpty().withMessage('Dropoff location is required'),
  body('pickup_time').isISO8601().withMessage('Valid pickup time is required'),
];

const reviewRules = [
  body('booking_id').isUUID().withMessage('Valid booking ID required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

module.exports = { registerRules, loginRules, bookingRules, reviewRules };
