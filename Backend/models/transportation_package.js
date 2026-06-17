const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const TransportationPackage = sequelize.define('TransportationPackage', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:          { type: DataTypes.STRING(150), allowNull: false },
  description:   { type: DataTypes.TEXT },
  price:         { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  duration_days: { type: DataTypes.INTEGER, allowNull: false },
  max_persons:   { type: DataTypes.INTEGER, allowNull: false },
  is_active:     { type: DataTypes.BOOLEAN, defaultValue: true },
}, { underscored: true, tableName: 'transportation_packages' });

module.exports = TransportationPackage;
