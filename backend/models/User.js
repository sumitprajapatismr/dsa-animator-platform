import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Student', 'Premium Student', 'Instructor', 'Admin'],
    default: 'Student'
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  
  // Profile & Gamification
  avatar: { type: String, default: '' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  coins: { type: Number, default: 0 },
  badges: [{
    badgeId: { type: String },
    name: { type: String },
    icon: { type: String },
    unlockedAt: { type: Date, default: Date.now }
  }],
  streak: {
    current: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    lastActive: { type: Date }
  },
  settings: {
    theme: { type: String, default: 'dark' },
    accent: { type: String, default: 'indigo' },
    fontSize: { type: String, default: 'base' },
    density: { type: String, default: 'comfortable' },
    glassmorphism: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
