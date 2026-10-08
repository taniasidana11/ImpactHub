import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';
import {
  registerForEvent,
  cancelRegistration,
} from '../controllers/volunteerController';
import { protect, authorize } from '../middleware/authMiddleware';
import validateObjectId from '../middleware/validateObjectId';

const router: Router = Router();

router.get('/', getAllEvents);
router.get('/:id', validateObjectId, getEventById);

router.post('/', protect, authorize('NGO'), createEvent);
router.put('/:id', validateObjectId, protect, authorize('NGO'), updateEvent);
router.delete('/:id', validateObjectId, protect, authorize('NGO', 'Admin'), deleteEvent);

router.post('/:id/register', validateObjectId, protect, authorize('Volunteer'), registerForEvent);
router.delete('/:id/register', validateObjectId, protect, authorize('Volunteer'), cancelRegistration);

export default router;