import Order from '../models/Order.js';
import Voucher from '../models/Voucher.js';
import Retailer from '../models/Retailer.js';
import WalletTransaction from '../models/WalletTransaction.js';

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.retailerId) {
      filter.retailerId = req.query.retailerId;
    }
    const orders = await Order.find(filter)
      .populate('retailerId')
      .populate('deliveryPartnerId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('retailerId', 'name storeName phone email')
      .populate('deliveryPartnerId', 'name phone');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Create a new order (handy for initial seeding/testing)
export const createOrder = async (req, res) => {
  try {
    const { retailerId, items, totalAmount, status, deliveryPartnerId, paymentMethod, transactionId } = req.body;

    console.log('[createOrder] Request body:', req.body);

    if (!retailerId || !items || !totalAmount) {
      console.log('[createOrder] Validation failed. retailerId:', retailerId, 'items:', items, 'totalAmount:', totalAmount);
      return res.status(400).json({ message: 'Please provide all required fields', debug: { retailerId, hasItems: !!items, totalAmount } });
    }

    const order = await Order.create({
      retailerId,
      items,
      totalAmount,
      status: status || 'Pending',
      deliveryPartnerId: deliveryPartnerId || null,
      paymentMethod: paymentMethod || 'COD',
      transactionId: transactionId || ''
    });

    // === AUTO CASHBACK/VOUCHER CALCULATION ===
    try {
      const retailer = await Retailer.findById(retailerId);
      if (retailer && !retailer.isWalletFrozen) {
        const now = new Date();
        const retailerTier = retailer.membershipTier || 'Bronze';

        // Find all active campaigns applicable to this order
        const activeCampaigns = await Voucher.find({
          status: 'Active',
          validFrom: { $lte: now },
          validTo: { $gte: now },
          minOrderValue: { $lte: totalAmount },
          eligibilityTier: { $in: ['All', retailerTier] }
        });

        let totalCashbackEarned = 0;
        let totalVoucherEarned = 0;

        for (const campaign of activeCampaigns) {
          // Calculate reward amount
          let rewardAmount = (campaign.discountPercentage / 100) * totalAmount;

          // Apply max cap
          if (campaign.maxDiscountCap > 0 && rewardAmount > campaign.maxDiscountCap) {
            rewardAmount = campaign.maxDiscountCap;
          }

          rewardAmount = Math.round(rewardAmount);

          if (rewardAmount <= 0) continue;

          if (campaign.rewardType === 'Cashback') {
            totalCashbackEarned += rewardAmount;

            // Create wallet transaction
            await WalletTransaction.create({
              retailerId,
              transactionType: 'Credit',
              amount: rewardAmount,
              reason: `Cashback - ${campaign.campaignName} (${campaign.discountPercentage}% on order)`,
              referenceId: `CB-${order._id.toString().slice(-6).toUpperCase()}`,
              status: 'Success'
            });
          } else if (campaign.rewardType === 'Voucher') {
            totalVoucherEarned += rewardAmount;

            // Create wallet transaction
            await WalletTransaction.create({
              retailerId,
              transactionType: 'Credit',
              amount: rewardAmount,
              reason: `Voucher Credit - ${campaign.campaignName} (${campaign.discountPercentage}% on order)`,
              referenceId: `VC-${order._id.toString().slice(-6).toUpperCase()}`,
              status: 'Success'
            });
          }
        }

        // Update retailer wallet balances
        if (totalCashbackEarned > 0 || totalVoucherEarned > 0) {
          const currentBalanceStr = retailer.walletBalance || 'Rs 0';
          const currentBalance = parseFloat(currentBalanceStr.replace(/[^0-9.-]+/g, '')) || 0;
          const newBalance = currentBalance + totalCashbackEarned + totalVoucherEarned;

          retailer.walletBalance = `Rs ${newBalance.toLocaleString()}`;
          retailer.cashbackBalance = (retailer.cashbackBalance || 0) + totalCashbackEarned;
          retailer.voucherBalance = (retailer.voucherBalance || 0) + totalVoucherEarned;
          await retailer.save();

          console.log(`[createOrder] Auto-rewards applied for retailer ${retailerId}: Cashback ₹${totalCashbackEarned}, Voucher ₹${totalVoucherEarned}`);
        }
      }
    } catch (rewardErr) {
      // Don't fail the order if reward calculation fails
      console.error('[createOrder] Auto-reward calculation error (order still created):', rewardErr);
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('retailerId')
      .populate('deliveryPartnerId');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Rejected') {
      order.rejectionReason = rejectionReason || 'Rejected by Admin';
    } else {
      order.rejectionReason = '';
    }

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate('retailerId')
      .populate('deliveryPartnerId');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Assign delivery partner
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryPartnerId } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryPartnerId = deliveryPartnerId || null;
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate('retailerId')
      .populate('deliveryPartnerId');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Assign delivery partner error:', error);
    res.status(500).json({ message: 'Error assigning delivery partner' });
  }
};

// Delete order record permanently
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Order.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
};
