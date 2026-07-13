import express from 'express';
import { getDashboardData, updateAlgoProgress, getCertificates, getLeaderboard } from '../controllers/progress.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardData);
router.get('/leaderboard', getLeaderboard);
router.post('/algo', updateAlgoProgress);
router.get('/certificates', getCertificates);

export default router;
