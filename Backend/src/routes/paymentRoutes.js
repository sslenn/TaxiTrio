const router = require('express').Router();
const ctrl = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middlewares/auth_middleware');

// Unified Payment service endpoints
router.post('/payments/create-payment', authenticate, authorize('traveler'), ctrl.createPayment);
router.get('/payments/verify-payment/:paymentId', authenticate, authorize('traveler'), ctrl.verifyPayment);

// Third-party KHQR Gateway integration specification routes
router.post('/khqr/create-payment', authenticate, authorize('traveler'), ctrl.gatewayCreateKHQRPayment);
router.get('/khqr/payment-status/:paymentId', authenticate, authorize('traveler'), ctrl.gatewayGetKHQRPaymentStatus);

// Webhook endpoints
router.post('/webhooks/stripe', ctrl.handleStripeWebhook);
router.post('/webhooks/khqr', ctrl.handleKHQRWebhook);

module.exports = router;
