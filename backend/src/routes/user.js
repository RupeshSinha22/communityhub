import express from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/user.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/profile/:userId', getProfile);
router.get('/me', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);

export default router;
