import { body, validationResult } from 'express-validator';

// Express validation error aggregator
export const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Auth forms
export const registerValidator = [
  body('name', 'Name is required').notEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  validateFields
];

export const loginValidator = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists(),
  validateFields
];

export const resetPasswordValidator = [
  body('password', 'Password is required and must be 6 or more characters').isLength({ min: 6 }),
  validateFields
];

// Room validation
export const roomValidator = [
  body('name', 'Room name is required').notEmpty().trim(),
  validateFields
];

// Problem execution validation
export const playgroundValidator = [
  body('code', 'Code is required').notEmpty(),
  body('language', 'Language is required').notEmpty(),
  validateFields
];
