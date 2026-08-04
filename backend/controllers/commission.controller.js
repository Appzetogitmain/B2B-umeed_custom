import CommissionPolicy from '../models/CommissionPolicy.js';
import Settlement from '../models/Settlement.js';

// GET all commission policies
export const getCommissionPolicies = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { policyName: { $regex: search, $options: 'i' } },
          { policyType: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const policies = await CommissionPolicy.find(query).sort({ createdAt: -1 });
    res.json(policies);
  } catch (error) {
    console.error('Get commission policies error:', error);
    res.status(500).json({ message: 'Error fetching commission policies' });
  }
};

// CREATE a commission policy
export const createCommissionPolicy = async (req, res) => {
  try {
    const { policyName, policyType, percentage, category, partnerRole, status } = req.body;

    if (!policyName || !policyType || percentage === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const percentageNum = Number(percentage);
    if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
      return res.status(400).json({ message: 'Percentage must be between 0 and 100' });
    }

    const policy = await CommissionPolicy.create({
      policyName,
      policyType,
      percentage: percentageNum,
      category: category || '',
      partnerRole: partnerRole || '',
      status: status || 'Active'
    });

    res.status(201).json(policy);
  } catch (error) {
    console.error('Create commission policy error:', error);
    res.status(500).json({ message: 'Error creating commission policy' });
  }
};

// UPDATE an existing commission policy
export const updateCommissionPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { policyName, policyType, percentage, category, partnerRole, status } = req.body;

    const policy = await CommissionPolicy.findById(id);
    if (!policy) {
      return res.status(404).json({ message: 'Commission policy not found' });
    }

    if (policyName !== undefined) policy.policyName = policyName;
    if (policyType !== undefined) policy.policyType = policyType;
    if (percentage !== undefined) {
      const percentageNum = Number(percentage);
      if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
        return res.status(400).json({ message: 'Percentage must be between 0 and 100' });
      }
      policy.percentage = percentageNum;
    }
    if (category !== undefined) policy.category = category;
    if (partnerRole !== undefined) policy.partnerRole = partnerRole;
    if (status !== undefined) policy.status = status;

    const updatedPolicy = await policy.save();
    res.json(updatedPolicy);
  } catch (error) {
    console.error('Update commission policy error:', error);
    res.status(500).json({ message: 'Error updating commission policy' });
  }
};

// DELETE a commission policy
export const deleteCommissionPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await CommissionPolicy.findById(id);
    if (!policy) {
      return res.status(404).json({ message: 'Commission policy not found' });
    }
    await policy.deleteOne();
    res.json({ message: 'Commission policy deleted successfully' });
  } catch (error) {
    console.error('Delete commission policy error:', error);
    res.status(500).json({ message: 'Error deleting commission policy' });
  }
};

import Order from '../models/Order.js';
import Partner from '../models/Partner.js';

// GET all settlements populated with partnerId
export const getSettlements = async (req, res) => {
  try {
    const partners = await Partner.find({});
    const currentDate = new Date();
    const periodString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }); // e.g. "May 2026"

    const policies = await CommissionPolicy.find({ status: 'Active' });

    for (let partner of partners) {
      const deliveredOrders = await Order.find({
        deliveryPartnerId: partner._id,
        status: 'Delivered'
      }).populate('items.product');

      let totalOrders = deliveredOrders.length;
      let totalOrderAmount = 0;
      let commissionEarned = 0;

      for (let order of deliveredOrders) {
        totalOrderAmount += order.totalAmount || 0;
        let orderCommission = 0;

        for (let policy of policies) {
          if (policy.policyType === 'Delivery Partner' &&
            policy.partnerRole.toLowerCase() === (partner.vehicleType || 'Bike').toLowerCase()) {
            orderCommission += (order.totalAmount * policy.percentage) / 100;
          } else if (policy.policyType === 'Category') {
            for (let item of order.items) {
              if (item.product && item.product.category &&
                item.product.category.toLowerCase() === policy.category.toLowerCase()) {
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                orderCommission += (itemTotal * policy.percentage) / 100;
              }
            }
          }
        }
        commissionEarned += orderCommission;
      }

      let settlement = await Settlement.findOne({ partnerId: partner._id, period: periodString });

      if (!settlement) {
        if (totalOrders > 0) {
          await Settlement.create({
            partnerId: partner._id,
            totalOrders,
            totalOrderAmount,
            commissionEarned: Math.round(commissionEarned),
            payoutStatus: 'Pending',
            period: periodString
          });
        }
      } else {
        settlement.totalOrders = totalOrders;
        settlement.totalOrderAmount = totalOrderAmount;
        settlement.commissionEarned = Math.round(commissionEarned);
        await settlement.save();
      }
    }

    const settlements = await Settlement.find({})
      .populate('partnerId')
      .sort({ createdAt: -1 });
    res.json(settlements);
  } catch (error) {
    console.error('Get settlements error:', error);
    res.status(500).json({ message: 'Error fetching settlements' });
  }
};

// UPDATE settlement payoutStatus
export const updateSettlementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payoutStatus } = req.body;

    if (!payoutStatus || !['Pending', 'Paid', 'Hold'].includes(payoutStatus)) {
      return res.status(400).json({ message: 'Please provide a valid payoutStatus' });
    }

    const settlement = await Settlement.findById(id);
    if (!settlement) {
      return res.status(404).json({ message: 'Settlement not found' });
    }

    settlement.payoutStatus = payoutStatus;
    const updatedSettlement = await settlement.save();

    // Populate partnerId before returning to match expected frontend structure
    const populated = await updatedSettlement.populate('partnerId');

    res.json(populated);
  } catch (error) {
    console.error('Update settlement status error:', error);
    res.status(500).json({ message: 'Error updating settlement status' });
  }
};
