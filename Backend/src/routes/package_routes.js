const router = require('express').Router();
const ctrl = require('../controllers/package_controller');
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
  limits: { fileSize: 5 * 1024 * 1024 }, // limit to 5MB for packages
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only images (JPG, PNG, WEBP) are allowed'));
  },
});

router.get('/packages', ctrl.getAll);
router.get('/packages/:id', ctrl.getById);

router.post('/admin/packages', authenticate, authorize('admin'), upload.single('image'), (req, res, next) => {
  if (req.file) {
    req.body.image_url = `/uploads/${req.file.filename}`;
  }
  next();
}, ctrl.create);

router.patch('/admin/packages/:id', authenticate, authorize('admin'), upload.single('image'), (req, res, next) => {
  if (req.file) {
    req.body.image_url = `/uploads/${req.file.filename}`;
  }
  next();
}, ctrl.update);

module.exports = router;
