import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock
} from '../controllers/product.controller.js';

const router = express.Router();

// Get all products
router.get('/', getProducts);

// Create Product
router.post('/', createProduct);

// Update Product Stock
router.put('/:id/stock', updateProductStock);

// Update Product
router.put('/:id', updateProduct);

// Delete Product
router.delete('/:id', deleteProduct);

export default router;

