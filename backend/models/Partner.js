import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleType: {
    type: String,
    default: 'Bike',
  },
  vehicleNumber: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'Active',
  },
  totalDeliveries: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: String,
    default: 'Rs 0',
  }
}, {
  timestamps: true
});

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;
