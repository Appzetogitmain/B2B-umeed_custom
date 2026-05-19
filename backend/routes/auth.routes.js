import express from 'express';
import { 
  registerRetailer, 
  loginRetailer, 
  updateRetailerProfile, 
  loginRetailerPartner,
  getAdminRetailers,
  createAdminRetailer,
  updateAdminRetailer,
  deleteAdminRetailer
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/retailer/signup', registerRetailer);
router.post('/retailer/login', loginRetailer);
router.post('/retailer/partner-login', loginRetailerPartner);
router.put('/retailer/update', updateRetailerProfile);

// Admin Retailer CRUD Routes
router.get('/admin/retailers', getAdminRetailers);
router.post('/admin/retailers', createAdminRetailer);
router.put('/admin/retailers/:id', updateAdminRetailer);
router.delete('/admin/retailers/:id', deleteAdminRetailer);

export default router;
