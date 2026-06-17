const router = require('express').Router();
const ctrl = require('../controllers/booking_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');
const validate = require('../middlewares/validate_middleware');
const { bookingRules } = require('../utils/validator');

router.post('/bookings', authenticate, authorize('traveler'), bookingRules, validate, ctrl.create);
router.post('/bookings/estimate', authenticate, authorize('traveler'), ctrl.estimate);
router.get('/bookings/my-bookings', authenticate, authorize('traveler'), ctrl.getMyBookings);
router.get('/bookings/:id', authenticate, ctrl.getById);
router.patch('/bookings/:id/cancel', authenticate, authorize('traveler'), ctrl.cancel);
router.get('/admin/bookings', authenticate, authorize('admin'), ctrl.getAllAdmin);
router.patch('/admin/bookings/:id/assign-driver', authenticate, authorize('admin'), ctrl.assignDriver);

module.exports = router;
