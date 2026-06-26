const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const BookingStatusHistory = sequelize.define('BookingStatusHistory', {
  id:     { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  status: {
    type: 'booking_status',
    allowNull: false,
  },
  note: { type: DataTypes.TEXT },
}, { underscored: true, tableName: 'booking_status_history', updatedAt: false });

module.exports = BookingStatusHistory;
