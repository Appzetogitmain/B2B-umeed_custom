import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Create Category
router.post('/', createCategory);

// Update Category
router.put('/:id', updateCategory);

// Delete Category
router.delete('/:id', deleteCategory);

export default router;
