import Order from '../models/Order.js';

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

// Create a new order (handy for initial seeding/testing)
export const createOrder = async (req, res) => {
  try {
    const { retailerId, items, totalAmount, status, deliveryPartnerId } = req.body;

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
      deliveryPartnerId: deliveryPartnerId || null
    });

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
