const { Notification } = require('../../models');

const getMyNotifications = async (userId) =>
  Notification.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] });

const markRead = async (id, userId) => {
  const n = await Notification.findOne({ where: { id, user_id: userId } });
  if (!n) throw { status: 404, message: 'Notification not found' };
  await n.update({ is_read: true });
  return n;
};

module.exports = { getMyNotifications, markRead };
