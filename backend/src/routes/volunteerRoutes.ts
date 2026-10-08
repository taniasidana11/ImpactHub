import { Router } from 'express';
import { getMyEvents } from '../controllers/volunteerController';
import { protect, authorize } from '../middleware/authMiddleware';

const router: Router = Router();

router.get(
  '/events',
  protect,
  authorize('Volunteer'),
  getMyEvents
);

export default router;