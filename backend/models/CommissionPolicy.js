import mongoose from 'mongoose';

const commissionPolicySchema = new mongoose.Schema({
  policyName: {
    type: String,
    required: true,
    trim: true
  },
  policyType: {
    type: String,
    required: true,
    enum: ['Category', 'Delivery Partner', 'Custom Tier']
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    default: ''
  },
  partnerRole: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const CommissionPolicy = mongoose.model('CommissionPolicy', commissionPolicySchema);

export default CommissionPolicy;
