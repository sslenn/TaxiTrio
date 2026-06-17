const router = require('express').Router();
const ctrl = require('../controllers/customTrip_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');

router.post('/custom-trip-requests', authenticate, authorize('traveler'), ctrl.create);
router.get('/custom-trip-requests/my-requests', authenticate, authorize('traveler'), ctrl.getMyRequests);
router.patch('/custom-trip-requests/:id/confirm', authenticate, authorize('traveler'), ctrl.confirmRequest);
router.post('/custom-trip-requests/:id/urgent', authenticate, authorize('traveler'), ctrl.markUrgent);
router.get('/admin/custom-trip-requests', authenticate, authorize('admin'), ctrl.getAll);
router.patch('/admin/custom-trip-requests/:id/approve', authenticate, authorize('admin'), ctrl.approve);
router.patch('/admin/custom-trip-requests/:id/reject', authenticate, authorize('admin'), ctrl.reject);

module.exports = router;
