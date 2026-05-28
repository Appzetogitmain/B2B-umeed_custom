import express from 'express';
import { getDashboardStats, getRetailerEarningAnalytics } from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/earnings/:retailerId', protect, getRetailerEarningAnalytics);

export default router;
