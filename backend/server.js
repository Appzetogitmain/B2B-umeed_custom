import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import { seedDefaultAdmin } from './utils/seedAdmin.js';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import bannerRoutes from './routes/banner.routes.js';
import partnerRoutes from './routes/partner.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import commissionRoutes from './routes/commission.routes.js';
import voucherRoutes from './routes/voucher.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import targetRoutes from './routes/target.routes.js';


// Load env vars
dotenv.config();

// Connect to database
connectDB().then(async () => {
  seedDefaultAdmin();
  try {
    const Order = (await import('./models/Order.js')).default;
    const Product = (await import('./models/Product.js')).default;
    const Retailer = (await import('./models/Retailer.js')).default;

    // Removed static mock orders as per user request to keep DB dynamic
  } catch (err) {
    console.error('❌ Auto-seeding orders failed:', err);
  }

  // Auto-seed Commission Policies & Settlements
  try {
    const CommissionPolicy = (await import('./models/CommissionPolicy.js')).default;
    const Settlement = (await import('./models/Settlement.js')).default;
    const Partner = (await import('./models/Partner.js')).default;

    // Removed static mock policies as per user request


    // Removed static seeding of Settlements as per user request to calculate dynamically

    // Removed static seeding of Wallet Transactions as per user request to calculate dynamically
    // Auto-seed Targets
    try {
      const Target = (await import('./models/Target.js')).default;
      // Removed static mock targets as per user request

    } catch (err) {
      console.error('❌ Auto-seeding targets failed:', err);
    }
  } catch (err) {
    console.error('❌ Auto-seeding commissions failed:', err);
  }
});

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Umeed API',
    status: 'Running'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/commissions', commissionRoutes);
app.use('/api/v1/vouchers', voucherRoutes);
app.use('/api/v1/wallets', walletRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/targets', targetRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5200;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
