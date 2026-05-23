import Order from '../models/Order.js';
import Razorpay from 'razorpay';

// GET all orders payment records
export const getPaymentRecords = async (req, res) => {
  try {
    const payments = await Order.find({})
      .populate('retailerId', 'storeName ownerName name email phone')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Get payment records error:', error);
    res.status(500).json({ message: 'Error fetching payment tracking records' });
  }
};

// PUT reconcile payment status (e.g., mark COD as Paid)
export const reconcilePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = status || 'Paid';
    
    // Auto-generate transaction ID for COD orders if they are marked Paid
    if (order.paymentStatus === 'Paid' && !order.transactionId) {
      order.transactionId = `PAY-${order.paymentMethod}-${Date.now().toString().slice(-6)}`.toUpperCase();
    }

    const updatedOrder = await order.save();
    
    res.json({
      message: 'Payment reconciled successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Reconcile payment status error:', error);
    res.status(500).json({ message: 'Error updating payment reconciliation' });
  }
};

// POST Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt_order_1' } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise for INR)
      currency,
      receipt
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
  }
};
