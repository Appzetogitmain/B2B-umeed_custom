import express from 'express';
import {
  getPaymentRecords,
  reconcilePaymentStatus,
  createRazorpayOrder
} from '../controllers/payment.controller.js';

const router = express.Router();

router.get('/', getPaymentRecords);
router.put('/:id/reconcile', reconcilePaymentStatus);
router.post('/razorpay/order', createRazorpayOrder);

export default router;
