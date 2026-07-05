const notificationService = require('../services/notification_service');
const stream = require('../utils/notificationStream');
const { successResponse } = require('../utils/response');

const getMyNotifications = async (req, res, next) => {
  try {
    const unreadOnly = req.query.unread === 'true';
    const data = await notificationService.getMyNotifications(req.user.id, unreadOnly);
    res.json(successResponse('Notifications fetched', data));
  } catch (e) {
    next(e);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.json(successResponse('Unread count fetched', { count }));
  } catch (e) {
    next(e);
  }
};

const markRead = async (req, res, next) => {
  try {
    const data = await notificationService.markRead(req.params.id, req.user.id);
    res.json(successResponse('Marked as read', data));
  } catch (e) {
    next(e);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    const data = await notificationService.markAllRead(req.user.id);
    res.json(successResponse('All notifications marked as read', data));
  } catch (e) {
    next(e);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const data = await notificationService.deleteNotification(req.params.id, req.user.id);
    res.json(successResponse('Notification deleted', data));
  } catch (e) {
    next(e);
  }
};

const subscribe = (req, res) => {
  const userId = req.user.id;
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  
  res.write(': connected\n\n');
  
  stream.addConnection(userId, res);
  
  const keepAlive = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 20000);
  
  req.on('close', () => {
    clearInterval(keepAlive);
    stream.removeConnection(userId, res);
  });
};

module.exports = { 
  getMyNotifications, 
  getUnreadCount, 
  markRead, 
  markAllRead, 
  deleteNotification,
  subscribe 
};
