const sequelize = require('../db/config/db_config');

const User                = require('./user');
const Vehicle             = require('./vehicle');
const Route               = require('./route');
const TransportationPackage = require('./transportation_package');
const Booking             = require('./booking');
const PaymentRecord       = require('./payment_record');
const CustomTripRequest   = require('./custom_trip_request');
const Review              = require('./review');
const Notification        = require('./notification');
const BookingStatusHistory = require('./booking_status_history');
const PricingRule         = require('./pricing_rule');

// Vehicle ↔ Driver
Vehicle.belongsTo(User, { as: 'driver', foreignKey: 'driver_id' });
User.hasMany(Vehicle,   { as: 'vehicles', foreignKey: 'driver_id' });

// Booking
Booking.belongsTo(User,    { as: 'traveler', foreignKey: 'traveler_id' });
Booking.belongsTo(User,    { as: 'driver',   foreignKey: 'driver_id' });
Booking.belongsTo(Vehicle, { as: 'vehicle',  foreignKey: 'vehicle_id' });
Booking.belongsTo(Route,   { as: 'route',    foreignKey: 'route_id' });
Booking.belongsTo(TransportationPackage, { as: 'package', foreignKey: 'package_id' });
User.hasMany(Booking, { as: 'travelerBookings', foreignKey: 'traveler_id' });
User.hasMany(Booking, { as: 'driverBookings',   foreignKey: 'driver_id' });

// PaymentRecord
PaymentRecord.belongsTo(Booking, { as: 'booking',  foreignKey: 'booking_id' });
PaymentRecord.belongsTo(User,    { as: 'traveler', foreignKey: 'traveler_id' });
PaymentRecord.belongsTo(User,    { as: 'verifier', foreignKey: 'verified_by' });
Booking.hasOne(PaymentRecord,    { as: 'payment',  foreignKey: 'booking_id' });

// CustomTripRequest
CustomTripRequest.belongsTo(User, { as: 'traveler', foreignKey: 'traveler_id' });
User.hasMany(CustomTripRequest,   { as: 'customTripRequests', foreignKey: 'traveler_id' });

// Review
Review.belongsTo(Booking, { as: 'booking',  foreignKey: 'booking_id' });
Review.belongsTo(User,    { as: 'traveler', foreignKey: 'traveler_id' });
Review.belongsTo(User,    { as: 'driver',   foreignKey: 'driver_id' });
Booking.hasOne(Review,    { as: 'review',   foreignKey: 'booking_id' });
User.hasMany(Review,      { as: 'driverReviews', foreignKey: 'driver_id' });

// Notification
Notification.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
User.hasMany(Notification,   { as: 'notifications', foreignKey: 'user_id' });

// BookingStatusHistory
BookingStatusHistory.belongsTo(Booking, { as: 'booking',    foreignKey: 'booking_id' });
BookingStatusHistory.belongsTo(User,    { as: 'changedBy',  foreignKey: 'changed_by' });
Booking.hasMany(BookingStatusHistory,   { as: 'statusHistory', foreignKey: 'booking_id' });

module.exports = {
  sequelize,
  User,
  Vehicle,
  Route,
  TransportationPackage,
  Booking,
  PaymentRecord,
  CustomTripRequest,
  Review,
  Notification,
  BookingStatusHistory,
  PricingRule,
};
