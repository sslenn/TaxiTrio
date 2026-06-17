const router = require('express').Router();
const ctrl = require('../controllers/route_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');

router.get('/routes', ctrl.getAll);
router.post('/admin/routes', authenticate, authorize('admin'), ctrl.create);
router.patch('/admin/routes/:id', authenticate, authorize('admin'), ctrl.update);

module.exports = router;
