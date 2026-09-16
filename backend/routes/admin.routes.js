import express from 'express';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../controllers/admin.controller.js';
import { protect, superAdminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.route('/employees')
  .get(protect, superAdminOnly, getEmployees)
  .post(protect, superAdminOnly, createEmployee);

router.route('/employees/:id')
  .put(protect, superAdminOnly, updateEmployee)
  .delete(protect, superAdminOnly, deleteEmployee);

export default router;
