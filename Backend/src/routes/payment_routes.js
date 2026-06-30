const router = require('express').Router();
const ctrl = require('../controllers/payment_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only images (JPG, PNG, WEBP) and PDF are allowed'));
  },
});

router.post('/payments', authenticate, authorize('traveler'), upload.single('proof'), (req, res, next) => {
  if (req.file) req.body.proof_url = `/uploads/${req.file.filename}`;
  next();
}, ctrl.create);

router.get('/payments/checkout/:bookingId', authenticate, authorize('traveler'), ctrl.getCheckout);
router.get('/payments/checkout/:bookingId/status', authenticate, authorize('traveler'), ctrl.getStatus);
router.post('/payments/checkout/:bookingId/stripe', authenticate, authorize('traveler'), ctrl.createStripeSession);
router.post('/payments/checkout/:bookingId/stripe-verify', authenticate, authorize('traveler'), ctrl.verifyStripePayment);
router.post('/payments/:bookingId/simulate-khqr-pay', authenticate, authorize('traveler'), ctrl.simulateKHQR);
router.post('/payments/:bookingId/simulate-aba-pay', authenticate, authorize('traveler'), ctrl.simulateABA);

router.get('/admin/payments', authenticate, authorize('admin'), ctrl.getAll);
router.patch('/admin/payments/:id/verify', authenticate, authorize('admin'), ctrl.verify);
router.patch('/admin/payments/:id/reject', authenticate, authorize('admin'), ctrl.reject);

module.exports = router;
