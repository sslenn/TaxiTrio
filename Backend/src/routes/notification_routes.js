const router = require('express').Router();
const ctrl = require('../controllers/notification_controller');
const { authenticate } = require('../middlewares/auth_middleware');

router.get('/notifications', authenticate, ctrl.getMyNotifications);
router.patch('/notifications/:id/read', authenticate, ctrl.markRead);

module.exports = router;
