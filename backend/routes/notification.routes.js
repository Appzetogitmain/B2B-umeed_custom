import express from 'express';
import { saveRetailerToken, saveDeliveryToken } from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/retailer/token', protect, saveRetailerToken);
router.post('/delivery/token', protect, saveDeliveryToken);

export default router;
