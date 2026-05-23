import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Retailer from '../models/Retailer.js';
import Partner from '../models/Partner.js';

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb+srv://sagarkiaan12_db_user:umeed123@cluster0.jp0uwmw.mongodb.net/?appName=Cluster0";

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(uri, { dbName: 'testfolder' });
    console.log('Connected to MongoDB.');

    // Fetch existing retailers
    const retailers = await Retailer.find({});
    if (retailers.length === 0) {
      console.log('No retailers found. Please register some retailers first.');
      process.exit(0);
    }

    // Fetch existing products
    const products = await Product.find({});
    if (products.length === 0) {
      console.log('No products found. Please add some products first.');
      process.exit(0);
    }

    // Fetch existing partners
    const partners = await Partner.find({});

    console.log('Clearing existing orders...');
    await Order.deleteMany({});

    console.log(`Found ${retailers.length} retailers, ${products.length} products, and ${partners.length} partners.`);

    const ordersToSeed = [];

    // Helper to get random products
    const getRandomItems = (count) => {
      const selected = [];
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const limit = Math.min(count, shuffled.length);
      for (let i = 0; i < limit; i++) {
        const p = shuffled[i];
        const qty = Math.floor(Math.random() * 5) + 1;
        const mrp = p.mrp || p.price || 100;
        const price = p.price || mrp;
        const discount = p.discount || Math.round(((mrp - price) / mrp) * 100) || 0;
        selected.push({
          product: p._id,
          name: p.name,
          quantity: qty,
          price: price,
          mrp: mrp,
          discount: discount
        });
      }
      return selected;
    };

    // 1. Pending Order
    const items1 = getRandomItems(2);
    const total1 = items1.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    ordersToSeed.push({
      retailerId: retailers[0]._id,
      items: items1,
      totalAmount: total1,
      status: 'Pending',
      deliveryPartnerId: null,
      rejectionReason: ''
    });

    // 2. Approved Order with Partner
    if (retailers.length > 1 || retailers.length > 0) {
      const retailer = retailers[1] || retailers[0];
      const items2 = getRandomItems(3);
      const total2 = items2.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      ordersToSeed.push({
        retailerId: retailer._id,
        items: items2,
        totalAmount: total2,
        status: 'Approved',
        deliveryPartnerId: partners.length > 0 ? partners[0]._id : null,
        rejectionReason: ''
      });
    }

    // 3. Delivered Order
    if (retailers.length > 2 || retailers.length > 0) {
      const retailer = retailers[2] || retailers[0];
      const items3 = getRandomItems(1);
      const total3 = items3.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      ordersToSeed.push({
        retailerId: retailer._id,
        items: items3,
        totalAmount: total3,
        status: 'Delivered',
        deliveryPartnerId: partners.length > 0 ? (partners[1] || partners[0])._id : null,
        rejectionReason: ''
      });
    }

    // 4. Rejected Order
    if (retailers.length > 0) {
      const retailer = retailers[0]._id;
      const items4 = getRandomItems(2);
      const total4 = items4.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      ordersToSeed.push({
        retailerId: retailer,
        items: items4,
        totalAmount: total4,
        status: 'Rejected',
        deliveryPartnerId: null,
        rejectionReason: 'Store credit limit exceeded / KYC doc clarification needed'
      });
    }

    const createdOrders = await Order.insertMany(ordersToSeed);
    console.log(`Successfully seeded ${createdOrders.length} orders!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
