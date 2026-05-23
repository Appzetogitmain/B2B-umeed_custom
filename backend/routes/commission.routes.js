import express from 'express';
import {
  getCommissionPolicies,
  createCommissionPolicy,
  updateCommissionPolicy,
  deleteCommissionPolicy,
  getSettlements,
  updateSettlementStatus
} from '../controllers/commission.controller.js';

const router = express.Router();

// Policy Routes
router.get('/policies', getCommissionPolicies);
router.post('/policies', createCommissionPolicy);
router.put('/policies/:id', updateCommissionPolicy);
router.delete('/policies/:id', deleteCommissionPolicy);

// Settlement Routes
router.get('/settlements', getSettlements);
router.put('/settlements/:id/status', updateSettlementStatus);

export default router;
