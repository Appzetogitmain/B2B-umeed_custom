import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  variantName: {
    type: String,
    default: '',
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  packetSize: {
    type: Number,
    default: 1
  },
  cartonSize: {
    type: Number,
    default: 1
  },
  description: {
    type: String,
    default: '',
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
