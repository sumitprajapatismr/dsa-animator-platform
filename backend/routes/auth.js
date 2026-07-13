import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleMockLogin,
  getSettings,
  updateSettings
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';
import { registerValidator, loginValidator, resetPasswordValidator } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/google-mock', googleMockLogin);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.get('/verify/:token', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPasswordValidator, resetPassword);
router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);

export default router;
