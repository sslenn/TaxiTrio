const router = require('express').Router();
const ctrl = require('../controllers/telegram_controller');

router.post('/webhook', ctrl.handleWebhook);

module.exports = router;
