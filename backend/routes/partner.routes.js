import express from 'express';
import {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner
} from '../controllers/partner.controller.js';

const router = express.Router();

router.get('/', getPartners);
router.post('/', createPartner);
router.put('/:id', updatePartner);
router.delete('/:id', deletePartner);

export default router;
