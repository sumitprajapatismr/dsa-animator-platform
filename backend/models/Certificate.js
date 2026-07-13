import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: String, required: true },
  topicName: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  certificateHash: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: true }
});

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
