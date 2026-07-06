import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const retailerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  phone: {
    type: String,
    default: '',
  },
  deliveryAddress: {
    type: String,
    default: '',
  },
  storeName: {
    type: String,
    default: '',
  },
  ownerName: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  gstNumber: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'Pending',
  },
  walletBalance: {
    type: String,
    default: 'Rs 0',
  },
  cashbackBalance: {
    type: Number,
    default: 0,
  },
  voucherBalance: {
    type: Number,
    default: 0,
  },
  giftPoints: {
    type: Number,
    default: 0,
  },
  profitSharing: {
    tier1: { type: Number, default: 0 },
    tier2: { type: Number, default: 0 },
    tier3: { type: Number, default: 0 },
  },
  activeCards: {
    type: Number,
    default: 0,
  },
  membershipTier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Elite Gold'],
    default: 'Bronze',
  },
  isWalletFrozen: {
    type: Boolean,
    default: false,
  },
  partners: {
    type: [{
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: false, default: '' },
      role: { type: String, required: true }
    }],
    default: []
  },
  registeredBy: {
    type: String,
    enum: ['admin', 'retailer-app'],
    default: 'retailer-app',
  },
  // Form fields added
  shopName: { type: String, default: '' },
  shopType: { type: String, default: '' },
  addressAsPerAadhaar: { type: String, default: '' },
  aadhaarState: { type: String, default: '' },
  aadhaarPin: { type: String, default: '' },
  aadhaarNo: { type: String, default: '' },
  panNo: { type: String, default: '' },
  partnerNameA: { type: String, default: '' },
  partnerNameB: { type: String, default: '' },
  whatsappNo: { type: String, default: '' },
  alternateContactName: { type: String, default: '' },
  alternateContactPhone: { type: String, default: '' },
  areaOfOperation: { type: String, default: '' },
  pinCode: { type: String, default: '' },
  state: { type: String, default: '' },
  bankName: { type: String, default: '' },
  ifscCode: { type: String, default: '' },
  bankBranch: { type: String, default: '' },
  accountHolderName: { type: String, default: '' },
  accountNo: { type: String, default: '' },
  retailShopName: { type: String, default: '' },
  completeAddress: { type: String, default: '' },
  landmark: { type: String, default: '' },
  policeStation: { type: String, default: '' },
  addressPinCode: { type: String, default: '' },
  addressState: { type: String, default: '' },
  photo: { type: String, default: '' },
  resetPasswordToken: { type: String, default: '' },
  resetPasswordExpires: { type: Date },
  fcmToken: {
    type: String,
    default: null
  },
  fcmTokenMobile: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
});

// Hash password before saving
retailerSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

retailerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Retailer = mongoose.model('Retailer', retailerSchema);

export default Retailer;
