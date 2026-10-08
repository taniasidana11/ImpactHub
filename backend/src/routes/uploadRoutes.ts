import { Router } from 'express';
import { uploadProfileImage, uploadCoverImage } from '../controllers/uploadController';
import { protect, authorize } from '../middleware/authMiddleware';
import upload from '../middleware/upload';

const router: Router = Router();

router.post(
  '/profile',
  protect,
  authorize('NGO'),
  upload.single('image'),
  uploadProfileImage
);

router.post(
  '/cover',
  protect,
  authorize('NGO'),
  upload.single('image'),
  uploadCoverImage
);

export default router;