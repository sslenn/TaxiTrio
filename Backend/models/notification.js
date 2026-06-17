const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const Notification = sequelize.define('Notification', {
  id:      { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title:   { type: DataTypes.STRING(150), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { underscored: true, tableName: 'notifications' });

module.exports = Notification;
