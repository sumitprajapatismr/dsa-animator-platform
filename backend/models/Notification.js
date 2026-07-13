import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ['achievement', 'streak', 'room_invite', 'general'],
    default: 'general'
  },
  createdAt: { type: Date, default: Date.now, expires: 2592000 } // Auto expires in 30 days
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
