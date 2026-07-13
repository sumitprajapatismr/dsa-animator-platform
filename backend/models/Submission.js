import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Compile Error', 'Runtime Error', 'Time Limit Exceeded'],
    required: true
  },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  runtime: { type: Number, default: 0 }, // in ms
  memory: { type: Number, default: 0 }, // in KB
  createdAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
