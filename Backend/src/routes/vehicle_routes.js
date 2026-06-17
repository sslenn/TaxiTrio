const router = require('express').Router();
const ctrl = require('../controllers/vehicle_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');

router.get('/vehicles', ctrl.getAll);
router.get('/admin/vehicles', authenticate, authorize('admin'), ctrl.getAll);
router.post('/admin/vehicles', authenticate, authorize('admin'), ctrl.create);
router.patch('/admin/vehicles/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/admin/vehicles/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
