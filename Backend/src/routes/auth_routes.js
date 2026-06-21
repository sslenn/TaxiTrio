const router = require('express').Router();
const ctrl = require('../controllers/auth_controller');
const { authenticate } = require('../middlewares/auth_middleware');
const validate = require('../middlewares/validate_middleware');
const { registerRules, loginRules } = require('../utils/validator');

const { authLimiter } = require('../middlewares/rate_limiter');

router.post('/register', authLimiter, registerRules, validate, ctrl.register);
router.post('/login', authLimiter, loginRules, validate, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', authenticate, ctrl.getMe);
router.post('/forgot-password', authLimiter, ctrl.forgotPassword);
router.post('/reset-password', authLimiter, ctrl.resetPassword);
router.post('/change-password', authenticate, ctrl.changePassword);
router.post('/activate-driver', ctrl.activateDriver);

// Google Sign-In (OAuth2) Routes
router.get('/google', ctrl.initiateGoogleAuth);
router.get('/google/callback', ctrl.handleGoogleCallback);

module.exports = router;
