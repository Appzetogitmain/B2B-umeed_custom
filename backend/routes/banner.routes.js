import express from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/banner.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Public
router.get('/', getBanners);

// Protected (admin)
router.post('/', protect, createBanner);
router.put('/:id', protect, updateBanner);
router.delete('/:id', protect, deleteBanner);

export default router;
