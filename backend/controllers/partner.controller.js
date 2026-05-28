import Partner from '../models/Partner.js';
import { generateToken } from '../middlewares/auth.js';

// Get all partners
export const getPartners = async (req, res) => {
  try {
    // Delete any old seeded static records ending in @deliverymail.com to fully clean the database
    await Partner.deleteMany({ email: { $regex: /@deliverymail\.com$/i } });

    const partners = await Partner.find({});
    res.json(partners);
  } catch (error) {
    console.error('Get partners error:', error);
    res.status(500).json({ message: 'Error fetching delivery partners' });
  }
};

// Create Partner
export const createPartner = async (req, res) => {
  try {
    const { name, phone, email, password, vehicleType, vehicleNumber, city, status } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'Name, phone, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if partner already exists
    const partnerExists = await Partner.findOne({ $or: [{ phone }, { email }] });
    if (partnerExists) {
      return res.status(400).json({ message: 'Partner with this phone or email already exists' });
    }

    const partner = await Partner.create({
      name,
      phone,
      email,
      password,
      vehicleType: vehicleType || 'Bike',
      vehicleNumber: vehicleNumber || '',
      city: city || '',
      status: status || 'Active',
      totalDeliveries: 0,
      earnings: 'Rs 0'
    });

    // Don't return password in response
    const partnerObj = partner.toObject();
    delete partnerObj.password;

    res.status(201).json(partnerObj);
  } catch (error) {
    console.error('Create partner error:', error);
    res.status(500).json({ message: 'Error creating delivery partner' });
  }
};

// Update Partner
export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, password, vehicleType, vehicleNumber, city, status, totalDeliveries, earnings } = req.body;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Check unique email/phone if changed
    if (phone && phone !== partner.phone) {
      const phoneExists = await Partner.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ message: 'Partner with this phone already exists' });
      }
      partner.phone = phone;
    }

    if (email && email !== partner.email) {
      const emailExists = await Partner.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Partner with this email already exists' });
      }
      partner.email = email;
    }

    if (name !== undefined) partner.name = name;
    if (password && password.trim() !== '') partner.password = password;
    if (vehicleType !== undefined) partner.vehicleType = vehicleType;
    if (vehicleNumber !== undefined) partner.vehicleNumber = vehicleNumber;
    if (city !== undefined) partner.city = city;
    if (status !== undefined) partner.status = status;
    if (totalDeliveries !== undefined) partner.totalDeliveries = totalDeliveries;
    if (earnings !== undefined) partner.earnings = earnings;

    const updatedPartner = await partner.save();
    const partnerObj = updatedPartner.toObject();
    delete partnerObj.password;

    res.json(partnerObj);
  } catch (error) {
    console.error('Update partner error:', error);
    res.status(500).json({ message: 'Error updating delivery partner' });
  }
};

// Delete Partner
export const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Delete partner error:', error);
    res.status(500).json({ message: 'Error deleting delivery partner' });
  }
};

// Login Delivery Partner
export const loginPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const partner = await Partner.findOne({ email: email.toLowerCase() });

    if (!partner) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (partner.status !== 'Active') {
      return res.status(403).json({ message: 'Your account is not active. Contact admin.' });
    }

    const isMatch = await partner.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: partner._id,
      name: partner.name,
      email: partner.email,
      phone: partner.phone,
      vehicleType: partner.vehicleType,
      vehicleNumber: partner.vehicleNumber,
      city: partner.city,
      status: partner.status,
      totalDeliveries: partner.totalDeliveries,
      earnings: partner.earnings,
      token: generateToken(partner._id, 'delivery'),
      message: 'Delivery partner logged in successfully'
    });
  } catch (error) {
    console.error('Partner login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
