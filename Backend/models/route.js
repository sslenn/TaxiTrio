const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const Route = sequelize.define('Route', {
  id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  origin:       { type: DataTypes.STRING(150), allowNull: false },
  destination:  { type: DataTypes.STRING(150), allowNull: false },
  distance_km:  { type: DataTypes.DECIMAL(8, 2), allowNull: false },
  base_price:   { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  duration_hrs: { type: DataTypes.DECIMAL(5, 2) },
  is_active:    { type: DataTypes.BOOLEAN, defaultValue: true },
}, { underscored: true, tableName: 'routes' });

module.exports = Route;
