import Partner from '../models/Partner.js';

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
    const { name, phone, email, vehicleType, vehicleNumber, city, status } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ message: 'Name, phone, and email are required' });
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
      vehicleType: vehicleType || 'Bike',
      vehicleNumber: vehicleNumber || '',
      city: city || '',
      status: status || 'Active',
      totalDeliveries: 0,
      earnings: 'Rs 0'
    });

    res.status(201).json(partner);
  } catch (error) {
    console.error('Create partner error:', error);
    res.status(500).json({ message: 'Error creating delivery partner' });
  }
};

// Update Partner
export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, vehicleType, vehicleNumber, city, status, totalDeliveries, earnings } = req.body;

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
    if (vehicleType !== undefined) partner.vehicleType = vehicleType;
    if (vehicleNumber !== undefined) partner.vehicleNumber = vehicleNumber;
    if (city !== undefined) partner.city = city;
    if (status !== undefined) partner.status = status;
    if (totalDeliveries !== undefined) partner.totalDeliveries = totalDeliveries;
    if (earnings !== undefined) partner.earnings = earnings;

    const updatedPartner = await partner.save();
    res.json(updatedPartner);
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
