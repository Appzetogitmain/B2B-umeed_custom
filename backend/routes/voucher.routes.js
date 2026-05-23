import express from 'express';
import {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher
} from '../controllers/voucher.controller.js';

const router = express.Router();

router.get('/', getVouchers);
router.post('/', createVoucher);
router.put('/:id', updateVoucher);
router.delete('/:id', deleteVoucher);

export default router;
