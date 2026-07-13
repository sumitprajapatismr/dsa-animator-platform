import crypto from 'crypto';
import Room from '../models/Room.js';

// @desc    Create a collaborative room
// @route   POST /api/rooms
// @access  Private
export const createRoom = async (req, res, next) => {
  const { name, language } = req.body;

  try {
    const roomCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 character code

    const room = await Room.create({
      roomCode,
      name,
      host: req.user.id,
      language: language || 'javascript',
      members: [req.user.id]
    });

    res.status(201).json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// @desc    Get room details by code
// @route   GET /api/rooms/:code
// @access  Private
export const getRoomByCode = async (req, res, next) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.code.toUpperCase() })
      .populate('host', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// @desc    Join room (REST side checks, socket handles real-time joining)
// @route   POST /api/rooms/:code/join
// @access  Private
export const joinRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.code.toUpperCase() });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (!room.members.includes(req.user.id)) {
      room.members.push(req.user.id);
      await room.save();
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    next(error);
  }
};
