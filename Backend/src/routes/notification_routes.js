const router = require('express').Router();
const ctrl = require('../controllers/notification_controller');
const { authenticate } = require('../middlewares/auth_middleware');

router.get('/notifications', authenticate, ctrl.getMyNotifications);
router.get('/notifications/stream', authenticate, ctrl.subscribe);
router.get('/notifications/unread-count', authenticate, ctrl.getUnreadCount);
router.patch('/notifications/read-all', authenticate, ctrl.markAllRead);
router.patch('/notifications/:id/read', authenticate, ctrl.markRead);
router.delete('/notifications/:id', authenticate, ctrl.deleteNotification);

module.exports = router;
