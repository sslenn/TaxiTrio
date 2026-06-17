const router = require('express').Router();
const ctrl = require('../controllers/booking_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');

const setStatus = (status) => (req, res, next) => { req.body = { ...req.body, status }; next(); };

router.get('/driver/bookings', authenticate, authorize('driver'), ctrl.getDriverBookings);
router.patch('/driver/bookings/:id/accept', authenticate, authorize('driver'), setStatus('accepted'), ctrl.updateDriverStatus);
router.patch('/driver/bookings/:id/reject', authenticate, authorize('driver'), setStatus('rejected'), ctrl.updateDriverStatus);
router.patch('/driver/bookings/:id/status', authenticate, authorize('driver'), ctrl.updateDriverStatus);
router.get('/driver/earnings', authenticate, authorize('driver'), ctrl.getDriverEarnings);
router.get('/driver/trip-history', authenticate, authorize('driver'), ctrl.getDriverTripHistory);
router.get('/admin/drivers', authenticate, authorize('admin'), require('../controllers/user_controller').getAllDrivers);

module.exports = router;
