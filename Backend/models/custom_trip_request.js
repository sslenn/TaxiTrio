const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const CustomTripRequest = sequelize.define('CustomTripRequest', {
  id:               { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  origin:           { type: DataTypes.TEXT, allowNull: false },
  destination:      { type: DataTypes.TEXT, allowNull: false },
  travel_date:      { type: DataTypes.DATEONLY, allowNull: false },
  travel_time:      { type: DataTypes.STRING(50) },
  passengers:       { type: DataTypes.INTEGER, allowNull: false },
  special_requests: { type: DataTypes.TEXT },
  status:           { 
    type: 'custom_trip_status', 
    defaultValue: 'pending' 
  },
  admin_note:       { type: DataTypes.TEXT },
  quoted_price:     { type: DataTypes.DECIMAL(10, 2) },
  traveler_response: { type: DataTypes.TEXT },
  telegram_contact:  { type: DataTypes.STRING(100) },
  is_urgent_requested: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { underscored: true, tableName: 'custom_trip_requests' });

module.exports = CustomTripRequest;
