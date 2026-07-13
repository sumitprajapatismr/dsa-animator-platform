import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  codeContent: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  whiteboardDrawings: [{
    type: { type: String }, // 'draw', 'clear', 'erase'
    points: [{ x: Number, y: Number }],
    color: { type: String },
    brushSize: { type: Number }
  }],
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto expires in 24 hours
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
