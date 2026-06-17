const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const Vehicle = sequelize.define('Vehicle', {
  id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  plate_number: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  type:         { type: DataTypes.ENUM('sedan','suv','van','minibus','bus'), allowNull: false },
  brand:        { type: DataTypes.STRING(50) },
  model:        { type: DataTypes.STRING(50) },
  capacity:     { type: DataTypes.INTEGER, allowNull: false },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { underscored: true, tableName: 'vehicles' });

module.exports = Vehicle;
