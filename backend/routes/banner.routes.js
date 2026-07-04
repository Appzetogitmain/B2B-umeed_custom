import express from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/banner.controller.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../utils/imageUpload.js';

const router = express.Router();

// Public
router.get('/', getBanners);

// Protected (admin)
router.post('/', protect, upload.single('image'), createBanner);
router.put('/:id', protect, upload.single('image'), updateBanner);
router.delete('/:id', protect, deleteBanner);

export default router;
