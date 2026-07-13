import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// JWT generation helpers
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_dsa_jwt_key_12345', {
    expiresIn: process.env.JWT_EXPIRE || '15m'
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'super_secret_dsa_refresh_key_67890', {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  });
};

// Send Refresh Token in secure cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      coins: user.coins,
      streak: user.streak,
      badges: user.badges
    }
  });
};

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    user = await User.create({
      name,
      email,
      password,
      verificationToken
    });

    // Create welcome notification
    await Notification.create({
      user: user._id,
      title: 'Welcome to AlgoFlow AI! ⚡',
      message: 'Explore the DSA Visualizers, practice in the Playground, or collaborate in real-time rooms.',
      type: 'general'
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update streak logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = user.streak.lastActive ? new Date(user.streak.lastActive) : null;
    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today - lastActive);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak.current += 1;
        if (user.streak.current > user.streak.max) {
          user.streak.max = user.streak.current;
        }
        // Send streak unlock notifications if thresholds reached
        if (user.streak.current === 3 || user.streak.current === 7) {
          await Notification.create({
            user: user._id,
            title: '🔥 Streak Level Up!',
            message: `You have reached a ${user.streak.current}-day coding streak!`,
            type: 'streak'
          });
        }
      } else if (diffDays > 1) {
        user.streak.current = 1; // streak broken, reset to 1
      }
    } else {
      user.streak.current = 1; // first log
    }
    user.streak.lastActive = new Date();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res, next) => {
  try {
    res.cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ success: true, message: 'User logged out' });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'super_secret_dsa_refresh_key_67890');
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token user' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Email
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    
    // Give 100 XP for verification
    user.xp += 100;
    user.coins += 50;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully! You received +100 XP and +50 Coins.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user with that email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Reset password link generated.',
      resetToken // sending in body for easy testing/local run mock
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Mock Google Auth Login/Register
// @route   POST /api/auth/google-mock
// @access  Public
export const googleMockLogin = async (req, res, next) => {
  const { email, name } = req.body;
  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const dummyPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name: name || 'Google User',
        email: email.toLowerCase(),
        password: dummyPassword,
        isVerified: true
      });

      await Notification.create({
        user: user._id,
        title: 'Google Sign-In Complete! ⚡',
        message: 'Welcome to AlgoFlow AI via secure Google authentication.',
        type: 'general'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get User Customization Settings
// @route   GET /api/auth/settings
// @access  Private
export const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('settings');
    res.status(200).json({ success: true, settings: user.settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update User Customization Settings
// @route   PUT /api/auth/settings
// @access  Private
export const updateSettings = async (req, res, next) => {
  const { theme, accent, fontSize, density, glassmorphism } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (theme) user.settings.theme = theme;
    if (accent) user.settings.accent = accent;
    if (fontSize) user.settings.fontSize = fontSize;
    if (density) user.settings.density = density;
    if (glassmorphism !== undefined) user.settings.glassmorphism = glassmorphism;

    await user.save();
    res.status(200).json({ success: true, settings: user.settings });
  } catch (error) {
    next(error);
  }
};
