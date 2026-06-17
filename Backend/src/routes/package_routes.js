const router = require('express').Router();
const ctrl = require('../controllers/package_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');

router.get('/packages', ctrl.getAll);
router.get('/packages/:id', ctrl.getById);
router.post('/admin/packages', authenticate, authorize('admin'), ctrl.create);
router.patch('/admin/packages/:id', authenticate, authorize('admin'), ctrl.update);

module.exports = router;
