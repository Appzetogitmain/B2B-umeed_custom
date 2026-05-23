import express from 'express';
import { 
  registerRetailer, 
  loginRetailer, 
  updateRetailerProfile, 
  loginRetailerPartner,
  getAdminRetailers,
  createAdminRetailer,
  updateAdminRetailer,
  deleteAdminRetailer,
  forgotPasswordRetailer,
  resetPasswordRetailer,
  loginAdmin,
  updateAdminPassword
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/retailer/signup', registerRetailer);
router.post('/retailer/login', loginRetailer);
router.post('/retailer/partner-login', loginRetailerPartner);
router.put('/retailer/update', updateRetailerProfile);
router.post('/retailer/forgot-password', forgotPasswordRetailer);
router.post('/retailer/reset-password/:token', resetPasswordRetailer);

// Admin Auth Routes
router.post('/admin/login', loginAdmin);
router.put('/admin/update-password', updateAdminPassword);

// Admin Retailer CRUD Routes
router.get('/admin/retailers', getAdminRetailers);
router.post('/admin/retailers', createAdminRetailer);
router.put('/admin/retailers/:id', updateAdminRetailer);
router.delete('/admin/retailers/:id', deleteAdminRetailer);

export default router;
