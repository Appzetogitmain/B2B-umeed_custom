import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema({
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
    required: true
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['Credit', 'Debit']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  referenceId: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['Success', 'Pending', 'Failed'],
    default: 'Success'
  }
}, {
  timestamps: true
});

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);

export default WalletTransaction;
