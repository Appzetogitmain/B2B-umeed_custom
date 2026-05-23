import mongoose from 'mongoose';

const targetSchema = new mongoose.Schema({
  targetName: {
    type: String,
    required: true,
    trim: true
  },
  targetMonth: {
    type: String,
    required: true,
    trim: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Branch', 'Category', 'Store-specific'],
    default: 'Branch'
  },
  targetCriteria: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentSales: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Achieved', 'Failed'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const Target = mongoose.model('Target', targetSchema);

export default Target;
