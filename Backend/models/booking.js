const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const Booking = sequelize.define('Booking', {
  id:               { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  booking_type:     { 
    type: 'booking_type', 
    allowNull: false 
  },
  status:           {
    type: 'booking_status',
    defaultValue: 'pending_payment',
  },
  pickup_location:  { type: DataTypes.TEXT },
  dropoff_location: { type: DataTypes.TEXT },
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
