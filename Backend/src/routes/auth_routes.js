const router = require('express').Router();
const ctrl = require('../controllers/auth_controller');
const { authenticate } = require('../middlewares/auth_middleware');
const validate = require('../middlewares/validate_middleware');
const { registerRules, loginRules } = require('../utils/validator');

router.post('/register', registerRules, validate, ctrl.register);
router.post('/login', loginRules, validate, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', authenticate, ctrl.getMe);

module.exports = router;
