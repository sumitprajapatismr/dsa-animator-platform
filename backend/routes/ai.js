import express from 'express';
import { askAITutor, getAICodeReview, getAIHint, getAIQuiz, conductInterview } from '../controllers/ai.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/ask', askAITutor);
router.post('/review', getAICodeReview);
router.post('/hint', getAIHint);
router.get('/quiz/:topic', getAIQuiz);
router.post('/interview', conductInterview);

export default router;
