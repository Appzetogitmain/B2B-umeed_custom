import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },
  totalOrders: {
    type: Number,
    required: true,
    default: 0
  },
  totalOrderAmount: {
    type: Number,
    required: true,
    default: 0
  },
  commissionEarned: {
    type: Number,
    required: true,
    default: 0
  },
  payoutStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Hold'],
    default: 'Pending'
  },
  period: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Settlement = mongoose.model('Settlement', settlementSchema);


export default Settlement;
