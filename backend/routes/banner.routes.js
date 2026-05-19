import express from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/banner.controller.js';

const router = express.Router();

// Get all banners
router.get('/', getBanners);

// Create Banner
router.post('/', createBanner);

// Update Banner
router.put('/:id', updateBanner);

// Delete Banner
router.delete('/:id', deleteBanner);

export default router;
