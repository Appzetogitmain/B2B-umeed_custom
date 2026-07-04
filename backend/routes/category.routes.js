import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../utils/imageUpload.js';

const router = express.Router();

// Public
router.get('/', getCategories);

// Protected (admin)
router.post('/', protect, upload.single('image'), createCategory);
router.put('/:id', protect, upload.single('image'), updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;
