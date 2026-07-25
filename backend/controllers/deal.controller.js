import Deal from '../models/Deal.js';
import Product from '../models/Product.js';

// Retailer creates a deal request
export const createDealRequest = async (req, res) => {
  try {
    const { productId, requestedQuantity, requestedRate, retailerMessage } = req.body;
    const retailerId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newDeal = new Deal({
      retailerId,
      productId,
      requestedQuantity,
      requestedRate,
      retailerMessage,
      status: 'PENDING'
    });

    await newDeal.save();
    res.status(201).json(newDeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin gets all deals (can filter by status)
export const getAllDeals = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const deals = await Deal.find(filter)
      .populate('retailerId', 'name storeName phone email')
      .populate('productId', 'name category variantName price mrp images')
      .sort({ createdAt: -1 });
      
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retailer gets their own deals
export const getRetailerDeals = async (req, res) => {
  try {
    const retailerId = req.user.id;
    const deals = await Deal.find({ retailerId })
      .populate('productId', 'name category variantName price mrp images')
      .sort({ createdAt: -1 });
      
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin responds with a counter offer or rejection
export const adminUpdateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, counterRate, counterQuantity, adminMessage } = req.body;

    // Status can be COUNTERED, ACCEPTED, or REJECTED
    if (!['COUNTERED', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const deal = await Deal.findById(id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    deal.status = status;
    if (adminMessage) deal.adminMessage = adminMessage;
    
    if (status === 'COUNTERED') {
      deal.counterRate = counterRate;
      deal.counterQuantity = counterQuantity || deal.requestedQuantity;
    } else if (status === 'ACCEPTED') {
      deal.finalRate = deal.requestedRate;
      deal.finalQuantity = deal.requestedQuantity;
    }

    await deal.save();
    res.status(200).json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retailer responds to a counter offer
export const retailerUpdateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACCEPTED or REJECTED
    const retailerId = req.user.id;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Can only Accept or Reject counter offer.' });
    }

    const deal = await Deal.findOne({ _id: id, retailerId });
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    if (deal.status !== 'COUNTERED') {
      return res.status(400).json({ message: 'Can only update a countered deal' });
    }

    deal.status = status;
    if (status === 'ACCEPTED') {
      deal.finalRate = deal.counterRate;
      deal.finalQuantity = deal.counterQuantity;
    }

    await deal.save();
    res.status(200).json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
