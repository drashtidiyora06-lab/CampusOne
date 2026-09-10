import express from 'express';
import { registerUser, loginUser, getMe, updateProfile, getDemoToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/demo-token', getDemoToken);
router.get('/demo-token', getDemoToken);

export default router;

