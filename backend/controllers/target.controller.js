import Target from '../models/Target.js';
import Order from '../models/Order.js';
import Retailer from '../models/Retailer.js';

// GET all monthly targets with dynamic sales computations
export const getTargets = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { targetName: { $regex: search, $options: 'i' } },
          { targetCriteria: { $regex: search, $options: 'i' } },
          { targetType: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const targets = await Target.find(filter);
    
    // Perform dynamic calculations for each target based on MongoDB orders
    for (let target of targets) {
      let salesAmount = 0;
      
      if (target.targetType === 'Branch') {
        // Find retailers in this city
        const cityRetailers = await Retailer.find({ 
          city: { $regex: new RegExp(`^${target.targetCriteria.trim()}$`, 'i') } 
        });
        
        if (cityRetailers.length > 0) {
          const retailerIds = cityRetailers.map(r => r._id);
          // Query delivered orders for these retailers
          const deliveredOrders = await Order.find({
            retailerId: { $in: retailerIds },
            status: 'Delivered'
          });
          salesAmount = deliveredOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        }
      } else if (target.targetType === 'Category') {
        // Query all delivered orders
        const deliveredOrders = await Order.find({ status: 'Delivered' }).populate('items.product');
        
        for (let order of deliveredOrders) {
          for (let item of order.items) {
            // Check if product category matches target criteria
            const categoryMatch = item.product && item.product.category && 
              item.product.category.toLowerCase().trim() === target.targetCriteria.toLowerCase().trim();
            
            if (categoryMatch) {
              // Calculate item total: quantity * price (or taking mrp/discount)
              const itemTotal = (item.price || 0) * (item.quantity || 1);
              salesAmount += itemTotal;
            }
          }
        }
      } else if (target.targetType === 'Store-specific') {
        // Find specific retailer store
        const storeRetailer = await Retailer.findOne({
          storeName: { $regex: new RegExp(`^${target.targetCriteria.trim()}$`, 'i') }
        });
        
        if (storeRetailer) {
          const deliveredOrders = await Order.find({
            retailerId: storeRetailer._id,
            status: 'Delivered'
          });
          salesAmount = deliveredOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        }
      }

      target.currentSales = Math.round(salesAmount);
      
      // Auto-achieve if target is met
      if (target.currentSales >= target.targetAmount && target.status === 'Active') {
        target.status = 'Achieved';
      } else if (target.currentSales < target.targetAmount && target.status === 'Achieved') {
        target.status = 'Active'; // Revert back if parameters were adjusted
      }
      
      await target.save();
    }

    // Reload calculated targets
    const updatedTargets = await Target.find(filter).sort({ createdAt: -1 });
    res.json(updatedTargets);
  } catch (error) {
    console.error('Get monthly targets error:', error);
    res.status(500).json({ message: 'Error calculating monthly target progress' });
  }
};

// CREATE monthly target
export const createTarget = async (req, res) => {
  try {
    const { targetName, targetMonth, targetType, targetCriteria, targetAmount, status } = req.body;

    if (!targetName || !targetMonth || !targetType || !targetCriteria || targetAmount === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const amtNum = Number(targetAmount);
    if (isNaN(amtNum) || amtNum < 0) {
      return res.status(400).json({ message: 'Target amount must be a positive number' });
    }

    const target = await Target.create({
      targetName,
      targetMonth,
      targetType,
      targetCriteria: targetCriteria.trim(),
      targetAmount: amtNum,
      currentSales: 0,
      status: status || 'Active'
    });

    res.status(201).json(target);
  } catch (error) {
    console.error('Create monthly target error:', error);
    res.status(500).json({ message: 'Error creating monthly target slab' });
  }
};

// UPDATE monthly target
export const updateTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetName, targetMonth, targetType, targetCriteria, targetAmount, status } = req.body;

    const target = await Target.findById(id);
    if (!target) {
      return res.status(404).json({ message: 'Target slab not found' });
    }

    if (targetName !== undefined) target.targetName = targetName;
    if (targetMonth !== undefined) target.targetMonth = targetMonth;
    if (targetType !== undefined) target.targetType = targetType;
    if (targetCriteria !== undefined) target.targetCriteria = targetCriteria.trim();
    if (status !== undefined) target.status = status;
    
    if (targetAmount !== undefined) {
      const amtNum = Number(targetAmount);
      if (isNaN(amtNum) || amtNum < 0) {
        return res.status(400).json({ message: 'Target amount must be a positive number' });
      }
      target.targetAmount = amtNum;
    }

    const updatedTarget = await target.save();
    res.json(updatedTarget);
  } catch (error) {
    console.error('Update monthly target error:', error);
    res.status(500).json({ message: 'Error updating monthly target parameters' });
  }
};

// DELETE monthly target
export const deleteTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await Target.findById(id);
    if (!target) {
      return res.status(404).json({ message: 'Target slab not found' });
    }
    await target.deleteOne();
    res.json({ message: 'Target slab deleted successfully' });
  } catch (error) {
    console.error('Delete monthly target error:', error);
    res.status(500).json({ message: 'Error deleting monthly target' });
  }
};
