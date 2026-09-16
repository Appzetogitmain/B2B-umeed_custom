import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

// Get all admins (employees)
export const getEmployees = async (req, res) => {
  try {
    const employees = await Admin.find({}).select('-password');
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
};

// Create a new employee (SubAdmin)
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const newAdmin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'Admin', // Default to sub-admin
      permissions: permissions || []
    });

    res.status(201).json({
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      permissions: newAdmin.permissions
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error creating employee' });
  }
};

// Update an employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, permissions, password } = req.body;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase();
    if (role) admin.role = role;
    if (permissions) admin.permissions = permissions;
    if (password) admin.password = password; // Will be hashed automatically by pre-save hook

    const updatedAdmin = await admin.save();

    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
      permissions: updatedAdmin.permissions
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error updating employee' });
  }
};

// Delete an employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting oneself
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.role === 'SuperAdmin') {
      return res.status(403).json({ message: 'Cannot delete a SuperAdmin' });
    }

    await Admin.findByIdAndDelete(id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
};
