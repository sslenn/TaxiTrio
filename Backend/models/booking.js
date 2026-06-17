const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const Booking = sequelize.define('Booking', {
  id:               { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  booking_type:     { type: DataTypes.ENUM('city_ride','intercity','package'), allowNull: false },
  status:           {
    type: DataTypes.ENUM(
      'pending_payment','payment_verified','driver_assigned',
      'accepted','rejected','en_route','arrived','in_progress','completed','cancelled'
    ),
    defaultValue: 'pending_payment',
  },
  pickup_location:  { type: DataTypes.STRING(255) },
  dropoff_location: { type: DataTypes.STRING(255) },
  pickup_lat:       { type: DataTypes.DECIMAL(10, 8) },
  pickup_lng:       { type: DataTypes.DECIMAL(11, 8) },
  dropoff_lat:      { type: DataTypes.DECIMAL(10, 8) },
  dropoff_lng:      { type: DataTypes.DECIMAL(11, 8) },
  distance_km:      { type: DataTypes.DECIMAL(8, 2) },
  duration_mins:    { type: DataTypes.INTEGER },
  pickup_time:      { type: DataTypes.DATE },
  total_fare:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  notes:            { type: DataTypes.TEXT },
}, { underscored: true, tableName: 'bookings' });

module.exports = Booking;
