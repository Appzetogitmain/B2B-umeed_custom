import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock
} from '../controllers/product.controller.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../utils/imageUpload.js';

const router = express.Router();

// Public - retailer app needs these without token for browsing
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected - admin only operations
router.post('/', protect, upload.array('images', 5), createProduct);
router.put('/:id/stock', protect, updateProductStock);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;

