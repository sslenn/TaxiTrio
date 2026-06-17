const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const BookingStatusHistory = sequelize.define('BookingStatusHistory', {
  id:     { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  status: {
    type: DataTypes.ENUM(
      'pending_payment','payment_verified','driver_assigned',
      'accepted','rejected','en_route','arrived','in_progress','completed','cancelled'
    ),
    allowNull: false,
  },
  note: { type: DataTypes.TEXT },
}, { underscored: true, tableName: 'booking_status_history', updatedAt: false });

module.exports = BookingStatusHistory;
