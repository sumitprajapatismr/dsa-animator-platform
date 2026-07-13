import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  achievementId: { type: String, required: true, unique: true }, // e.g. 'first_solve', 'streak_7'
  title: { type: String, required: true },
  description: { type: String, required: true },
  badgeIcon: { type: String, required: true }, // name of Lucide icon or URL
  xpReward: { type: Number, default: 0 },
  coinsReward: { type: Number, default: 0 },
  criteriaType: { type: String, required: true }, // 'problems', 'streak', 'xp', 'visualizer'
  criteriaValue: { type: Number, required: true }
});

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
