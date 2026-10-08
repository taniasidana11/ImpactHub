import { Router } from 'express';
import {
  getAllNGORequests,
  verifyNGO,
  getAllUsers,
  deleteUser,
  deleteEventAdmin,
  getStats,
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';
import validateObjectId from '../middleware/validateObjectId';

const router: Router = Router();

router.use(protect, authorize('Admin'));

router.get('/stats', getStats);
router.get('/ngos', getAllNGORequests);
router.put('/ngos/:id/verify', validateObjectId , verifyNGO);
router.get('/users', getAllUsers);
router.delete('/users/:id', validateObjectId, deleteUser);
router.delete('/events/:id', validateObjectId, deleteEventAdmin);

export default router;