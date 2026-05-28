import express from 'express';
import {
  getWalletTransactions,
  adjustWalletBalance,
  toggleWalletFreezeStatus,
  getRetailerWallet
} from '../controllers/wallet.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', protect, getWalletTransactions);
router.get('/retailer/:retailerId', protect, getRetailerWallet);
router.post('/adjust', protect, adjustWalletBalance);
router.post('/freeze/:retailerId', protect, toggleWalletFreezeStatus);

export default router;
