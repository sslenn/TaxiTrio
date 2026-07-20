const { Notification } = require('../../models');

const getMyNotifications = async (userId, unreadOnly = false) => {
  const where = { user_id: userId };
  if (unreadOnly) {
    where.is_read = false;
  }
  return Notification.findAll({ where, order: [['created_at', 'DESC']] });
};

const getUnreadCount = async (userId) => {
  return Notification.count({ where: { user_id: userId, is_read: false } });
};

const markRead = async (id, userId) => {
  const n = await Notification.findOne({ where: { id, user_id: userId } });
  if (!n) throw { status: 404, message: 'Notification not found' };
  await n.update({ is_read: true, read_at: new Date() });
  return n;
};

const markAllRead = async (userId) => {
  await Notification.update(
    { is_read: true, read_at: new Date() },
    { where: { user_id: userId, is_read: false } }
  );
  return { success: true };
};

const deleteNotification = async (id, userId) => {
  const n = await Notification.findOne({ where: { id, user_id: userId } });
  if (!n) throw { status: 404, message: 'Notification not found' };
  await n.destroy();
  return { success: true };
};

module.exports = { getMyNotifications, getUnreadCount, markRead, markAllRead, deleteNotification };
