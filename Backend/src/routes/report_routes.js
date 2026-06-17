const router = require('express').Router();
const ctrl = require('../controllers/report_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');

router.get('/admin/reports', authenticate, authorize('admin'), ctrl.getStats);

module.exports = router;
