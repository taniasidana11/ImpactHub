import { Router } from 'express';
import {
  getAllNGOs,
  getNGOById,
  getMyNGO,
  createNGO,
  updateNGO,
  deleteNGO,
} from '../controllers/ngoController';
import { protect, authorize } from '../middleware/authMiddleware';
import validateObjectId from '../middleware/validateObjectId';

const router: Router = Router();

router.get('/', getAllNGOs);

router.get('/me', protect, authorize('NGO'), getMyNGO);
router.get('/:id', validateObjectId, getNGOById);
router.post('/', protect, authorize('NGO'), createNGO);
router.put('/:id', validateObjectId, protect, authorize('NGO'), updateNGO);
router.delete('/:id', validateObjectId, protect, authorize('Admin'), deleteNGO);

export default router;