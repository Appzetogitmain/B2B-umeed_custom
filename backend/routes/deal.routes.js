import express from 'express';
import { 
  createDealRequest, 
  getAllDeals, 
  getRetailerDeals, 
  adminUpdateDeal, 
  retailerUpdateDeal 
} from '../controllers/deal.controller.js';
import { protect, adminOnly, retailerOnly } from '../middlewares/auth.js';

const router = express.Router();

// Retailer routes
router.post('/request', protect, retailerOnly, createDealRequest);
router.get('/my-deals', protect, retailerOnly, getRetailerDeals);
router.put('/:id/retailer-respond', protect, retailerOnly, retailerUpdateDeal);

// Admin routes
router.get('/all', protect, adminOnly, getAllDeals);
router.put('/:id/admin-respond', protect, adminOnly, adminUpdateDeal);

export default router;
