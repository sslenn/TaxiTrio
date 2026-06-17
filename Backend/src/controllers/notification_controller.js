const notificationService = require('../services/notification_service');
const { successResponse } = require('../utils/response');

const getMyNotifications = async (req, res, next) => {
  try { res.json(successResponse('Notifications fetched', await notificationService.getMyNotifications(req.user.id))); }
  catch (e) { next(e); }
};

const markRead = async (req, res, next) => {
  try { res.json(successResponse('Marked as read', await notificationService.markRead(req.params.id, req.user.id))); }
  catch (e) { next(e); }
};

module.exports = { getMyNotifications, markRead };
