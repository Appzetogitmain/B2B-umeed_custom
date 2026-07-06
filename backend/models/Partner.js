import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
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
  },
  fcmToken: {
    type: String,
    default: null
  },
  fcmTokenMobile: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
partnerSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

partnerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;
