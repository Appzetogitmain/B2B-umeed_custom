import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  assignDeliveryPartner,
  deleteOrder
} from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Get all orders
router.get('/', protect, getOrders);

// Get single order by ID
router.get('/:id', protect, getOrderById);

// Create order
router.post('/', protect, createOrder);

// Update order status (approve / reject)
router.put('/:id/status', protect, updateOrderStatus);

// Assign delivery partner
router.put('/:id/assign', protect, assignDeliveryPartner);

// Delete order record permanently
router.delete('/:id', protect, deleteOrder);

export default router;
