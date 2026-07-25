import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  requestedQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  requestedRate: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'COUNTERED', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  },
  counterRate: {
    type: Number,
    min: 0
  },
  counterQuantity: {
    type: Number,
    min: 1
  },
  finalRate: {
    type: Number,
    min: 0
  },
  finalQuantity: {
    type: Number,
    min: 1
  },
  adminMessage: {
    type: String,
    trim: true,
    default: ''
  },
  retailerMessage: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

const Deal = mongoose.model('Deal', dealSchema);
export default Deal;
