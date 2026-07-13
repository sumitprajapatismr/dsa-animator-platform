import express from 'express';
import { createRoom, getRoomByCode, joinRoom } from '../controllers/rooms.js';
import { protect } from '../middleware/auth.js';
import { roomValidator } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

router.post('/', roomValidator, createRoom);
router.get('/:code', getRoomByCode);
router.post('/:code/join', joinRoom);

export default router;
