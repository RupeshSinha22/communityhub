import express from 'express';
import { getProfile, updateProfile, getAllUsers, uploadProfilePic } from '../controllers/user.js';
import { authenticate } from '../middlewares/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.get('/', getAllUsers);
router.get('/profile/me', authenticate, getProfile);
router.get('/profile/:userId', getProfile);
router.patch('/profile', authenticate, updateProfile);
router.post('/profile/upload-pic', authenticate, upload.single('profilePic'), uploadProfilePic);

export default router;
