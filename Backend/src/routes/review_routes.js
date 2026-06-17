const router = require('express').Router();
const ctrl = require('../controllers/review_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');
const validate = require('../middlewares/validate_middleware');
const { reviewRules } = require('../utils/validator');

router.post('/reviews', authenticate, authorize('traveler'), reviewRules, validate, ctrl.create);

module.exports = router;
