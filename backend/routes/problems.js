import express from 'express';
import {
  getProblems,
  getProblemBySlug,
  runCodePlayground,
  submitCodePlayground
} from '../controllers/problems.js';
import { protect } from '../middleware/auth.js';
import { playgroundValidator } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getProblems);
router.get('/:slug', getProblemBySlug);

// Protected runner routes
router.post('/run', protect, playgroundValidator, runCodePlayground);
router.post('/:id/submit', protect, playgroundValidator, submitCodePlayground);

export default router;
