import express from 'express';
import {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
  loginPartner
} from '../controllers/partner.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', protect, getPartners);
router.post('/', protect, createPartner);
router.post('/login', loginPartner);
router.put('/:id', protect, updatePartner);
router.delete('/:id', protect, deletePartner);

export default router;
