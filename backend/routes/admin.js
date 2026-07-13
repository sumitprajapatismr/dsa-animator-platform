import express from 'express';
import { getAnalytics, getUsers, updateUserRole, deleteUser, createProblem } from '../controllers/admin.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.post('/problems', createProblem);

export default router;
