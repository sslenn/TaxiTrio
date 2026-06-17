const router = require('express').Router();
const ctrl = require('../controllers/user_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');
const authCtrl = require('../controllers/auth_controller');
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
  limits: { fileSize: 2 * 1024 * 1024 }, // limit to 2MB for avatars
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only images (JPG, PNG, WEBP) are allowed'));
  },
});

router.get('/profile', authenticate, authCtrl.getMe);
router.patch('/profile', authenticate, upload.single('avatar'), (req, res, next) => {
  if (req.file) req.body.avatar_url = `/uploads/${req.file.filename}`;
  next();
}, ctrl.updateProfile);

router.get('/admin/users', authenticate, authorize('admin'), ctrl.getAllUsers);
router.patch('/admin/users/:id/toggle', authenticate, authorize('admin'), ctrl.toggleUserStatus);

module.exports = router;
