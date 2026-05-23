import express from 'express';
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  assignDeliveryPartner,
  deleteOrder
} from '../controllers/order.controller.js';

const router = express.Router();

// Get all orders
router.get('/', getOrders);

// Create order
router.post('/', createOrder);

// Update order status (approve / reject)
router.put('/:id/status', updateOrderStatus);

// Assign delivery partner
router.put('/:id/assign', assignDeliveryPartner);

// Delete order record permanently
router.delete('/:id', deleteOrder);

export default router;
