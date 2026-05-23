import Voucher from '../models/Voucher.js';

// GET all campaigns
export const getVouchers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { campaignName: { $regex: search, $options: 'i' } },
          { voucherCode: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const vouchers = await Voucher.find(query).sort({ createdAt: -1 });
    res.json(vouchers);
  } catch (error) {
    console.error('Get vouchers error:', error);
    res.status(500).json({ message: 'Error fetching cashback & vouchers' });
  }
};

// CREATE new campaign
export const createVoucher = async (req, res) => {
  try {
    const { campaignName, voucherCode, rewardType, discountPercentage, minOrderValue, maxDiscountCap, eligibilityTier, validFrom, validTo, status } = req.body;

    if (!campaignName || !voucherCode || !rewardType || discountPercentage === undefined || !validFrom || !validTo) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const codeUpper = voucherCode.trim().toUpperCase();

    // Check duplicate promo code
    const existing = await Voucher.findOne({ voucherCode: codeUpper });
    if (existing) {
      return res.status(400).json({ message: `Voucher code '${codeUpper}' already exists` });
    }

    const percentageNum = Number(discountPercentage);
    if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
      return res.status(400).json({ message: 'Percentage must be between 0 and 100' });
    }

    const voucher = await Voucher.create({
      campaignName,
      voucherCode: codeUpper,
      rewardType,
      discountPercentage: percentageNum,
      minOrderValue: Number(minOrderValue || 0),
      maxDiscountCap: Number(maxDiscountCap || 0),
      eligibilityTier: eligibilityTier || 'All',
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      status: status || 'Active'
    });

    res.status(201).json(voucher);
  } catch (error) {
    console.error('Create voucher error:', error);
    res.status(500).json({ message: 'Error creating cashback & voucher campaign' });
  }
};

// UPDATE campaign
export const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { campaignName, voucherCode, rewardType, discountPercentage, minOrderValue, maxDiscountCap, eligibilityTier, validFrom, validTo, status } = req.body;

    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaignName !== undefined) voucher.campaignName = campaignName;
    if (voucherCode !== undefined) {
      const codeUpper = voucherCode.trim().toUpperCase();
      if (codeUpper !== voucher.voucherCode) {
        const existing = await Voucher.findOne({ voucherCode: codeUpper });
        if (existing) {
          return res.status(400).json({ message: `Voucher code '${codeUpper}' already exists` });
        }
        voucher.voucherCode = codeUpper;
      }
    }
    if (rewardType !== undefined) voucher.rewardType = rewardType;
    if (discountPercentage !== undefined) {
      const percentageNum = Number(discountPercentage);
      if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
        return res.status(400).json({ message: 'Percentage must be between 0 and 100' });
      }
      voucher.discountPercentage = percentageNum;
    }
    if (minOrderValue !== undefined) voucher.minOrderValue = Number(minOrderValue);
    if (maxDiscountCap !== undefined) voucher.maxDiscountCap = Number(maxDiscountCap);
    if (eligibilityTier !== undefined) voucher.eligibilityTier = eligibilityTier;
    if (validFrom !== undefined) voucher.validFrom = new Date(validFrom);
    if (validTo !== undefined) voucher.validTo = new Date(validTo);
    if (status !== undefined) voucher.status = status;

    const updatedVoucher = await voucher.save();
    res.json(updatedVoucher);
  } catch (error) {
    console.error('Update voucher error:', error);
    res.status(500).json({ message: 'Error updating cashback & voucher campaign' });
  }
};

// DELETE campaign
export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    await voucher.deleteOne();
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Delete voucher error:', error);
    res.status(500).json({ message: 'Error deleting campaign' });
  }
};
