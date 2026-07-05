const { DataTypes } = require('sequelize');
const sequelize = require('../db/config/db_config');

const Notification = sequelize.define('Notification', {
  id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title:        { type: DataTypes.STRING(150), allowNull: false },
  message:      { type: DataTypes.TEXT, allowNull: false },
  is_read:      { type: DataTypes.BOOLEAN, defaultValue: false },
  type:         { type: DataTypes.STRING(50), allowNull: true },
  related_type: { type: DataTypes.STRING(50), allowNull: true },
  related_id:   { type: DataTypes.STRING(100), allowNull: true },
  action_url:   { type: DataTypes.STRING(255), allowNull: true },
  priority:     { type: DataTypes.ENUM('Low', 'Normal', 'High', 'Critical'), defaultValue: 'Normal' },
  read_at:      { type: DataTypes.DATE, allowNull: true },
  metadata:     { type: DataTypes.JSONB, allowNull: true }
}, { underscored: true, tableName: 'notifications' });

Notification.addHook('afterCreate', (notification, options) => {
  try {
    const stream = require('../src/utils/notificationStream');
    stream.sendToUser(notification.user_id, notification);
  } catch (err) {
    console.error('Failed to trigger notification hook:', err);
  }
});

module.exports = Notification;
