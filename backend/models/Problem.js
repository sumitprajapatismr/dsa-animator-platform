import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  description: { type: String, required: true },
  constraints: [{ type: String }],
  examples: [{
    input: { type: String },
    output: { type: String },
    explanation: { type: String }
  }],
  codeTemplates: [{
    language: { type: String, required: true }, // e.g. javascript, python, cpp, java, c
    template: { type: String, required: true }
  }],
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
  }],
  timeComplexity: { type: String }, // e.g. O(N log N)
  spaceComplexity: { type: String }, // e.g. O(N)
  tags: [{ type: String }], // e.g. 'sorting', 'two-pointer', 'array'
  videoUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
