import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  storeType: {
    type: String,
    enum: ['Centralised', 'Super Hub', 'Dark Store'],
    required: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  }
}, { timestamps: true });

export default mongoose.model('Store', StoreSchema);
