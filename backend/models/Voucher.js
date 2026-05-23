import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  campaignName: {
    type: String,
    required: true,
    trim: true
  },
  voucherCode: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    uppercase: true
  },
  rewardType: {
    type: String,
    required: true,
    enum: ['Cashback', 'Voucher']
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  minOrderValue: {
    type: Number,
    required: true,
    default: 0
  },
  maxDiscountCap: {
    type: Number,
    required: true,
    default: 0
  },
  eligibilityTier: {
    type: String,
    required: true,
    enum: ['All', 'Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'All'
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Expired', 'Draft'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const Voucher = mongoose.model('Voucher', voucherSchema);

export default Voucher;
