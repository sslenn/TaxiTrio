const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const User = sequelize.define('User', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  full_name:  { type: DataTypes.STRING(100), allowNull: false },
  email:      { type: DataTypes.STRING(150), allowNull: false, unique: true },
  phone:      { type: DataTypes.STRING(20) },
  password:   { type: DataTypes.STRING(255), allowNull: false },
  role:       { type: DataTypes.ENUM('traveler', 'driver', 'admin'), defaultValue: 'traveler' },
  avatar_url: { type: DataTypes.STRING(500) },
  is_active:  { type: DataTypes.BOOLEAN, defaultValue: true },
}, { underscored: true, tableName: 'users' });

module.exports = User;
