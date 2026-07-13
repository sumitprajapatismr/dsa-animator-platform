import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: String, required: true }, // e.g., 'sorting', 'arrays', 'graphs'
  completedPercentage: { type: Number, default: 0 },
  completedAlgorithms: [{ type: String }], // List of algorithm IDs viewed/learned
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  completedQuizzes: [{
    quizId: { type: String },
    score: { type: Number },
    totalQuestions: { type: Number },
    completedAt: { type: Date, default: Date.now }
  }],
  lastActive: { type: Date, default: Date.now }
});

// Ensure uniqueness of topic tracker per user
progressSchema.index({ user: 1, topicId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
