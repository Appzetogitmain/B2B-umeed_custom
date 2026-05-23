import express from 'express';
import {
  getWalletTransactions,
  adjustWalletBalance,
  toggleWalletFreezeStatus
} from '../controllers/wallet.controller.js';

const router = express.Router();

router.get('/', getWalletTransactions);
router.post('/adjust', adjustWalletBalance);
router.post('/freeze/:retailerId', toggleWalletFreezeStatus);

export default router;
