import WalletTransaction from '../models/WalletTransaction.js';
import Retailer from '../models/Retailer.js';
import Order from '../models/Order.js';
import Voucher from '../models/Voucher.js';

// GET all wallet transactions
export const getWalletTransactions = async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({})
      .populate('retailerId', 'storeName ownerName name email phone walletBalance isWalletFrozen')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Get wallet transactions error:', error);
    res.status(500).json({ message: 'Error fetching wallet ledger' });
  }
};

// POST manual credit/debit adjustment
export const adjustWalletBalance = async (req, res) => {
  try {
    const { retailerId, transactionType, amount, reason, referenceId, category } = req.body;

    if (!retailerId || !transactionType || amount === undefined || !reason) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const amtNum = Number(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const retailer = await Retailer.findById(retailerId);
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    if (retailer.isWalletFrozen) {
      return res.status(400).json({ message: "Retailer's wallet is currently frozen. Cannot adjust balance." });
    }

    // Parse the current formatted wallet balance string (e.g. "Rs 12,540") to integer
    const currentBalanceStr = retailer.walletBalance || 'Rs 0';
    const currentBalance = parseFloat(currentBalanceStr.replace(/[^0-9.-]+/g, '')) || 0;

    let newBalance = 0;
    if (transactionType === 'Credit') {
      newBalance = currentBalance + amtNum;
    } else if (transactionType === 'Debit') {
      if (currentBalance < amtNum) {
        return res.status(400).json({ message: `Insufficient wallet balance. Current: Rs ${currentBalance.toLocaleString()}` });
      }
      newBalance = currentBalance - amtNum;
    } else {
      return res.status(400).json({ message: 'Invalid transaction type. Use Credit or Debit.' });
    }

    // Update retailer wallet balance
    retailer.walletBalance = `Rs ${newBalance.toLocaleString()}`;

    // Update sub-category balances if category is specified
    const sign = transactionType === 'Credit' ? 1 : -1;
    if (category === 'cashback') {
      retailer.cashbackBalance = Math.max(0, (retailer.cashbackBalance || 0) + (sign * amtNum));
    } else if (category === 'voucher') {
      retailer.voucherBalance = Math.max(0, (retailer.voucherBalance || 0) + (sign * amtNum));
    } else if (category === 'giftPoints') {
      retailer.giftPoints = Math.max(0, (retailer.giftPoints || 0) + (sign * amtNum));
    } else if (category === 'profitSharing-tier1') {
      if (!retailer.profitSharing) retailer.profitSharing = { tier1: 0, tier2: 0, tier3: 0 };
      retailer.profitSharing.tier1 = Math.max(0, (retailer.profitSharing.tier1 || 0) + (sign * amtNum));
      retailer.markModified('profitSharing');
    } else if (category === 'profitSharing-tier2') {
      if (!retailer.profitSharing) retailer.profitSharing = { tier1: 0, tier2: 0, tier3: 0 };
      retailer.profitSharing.tier2 = Math.max(0, (retailer.profitSharing.tier2 || 0) + (sign * amtNum));
      retailer.markModified('profitSharing');
    } else if (category === 'profitSharing-tier3') {
      if (!retailer.profitSharing) retailer.profitSharing = { tier1: 0, tier2: 0, tier3: 0 };
      retailer.profitSharing.tier3 = Math.max(0, (retailer.profitSharing.tier3 || 0) + (sign * amtNum));
      retailer.markModified('profitSharing');
    }

    await retailer.save();

    // Create the ledger transaction log
    const transaction = await WalletTransaction.create({
      retailerId,
      transactionType,
      amount: amtNum,
      reason: reason.trim(),
      referenceId: (referenceId || `ADJ-${Date.now().toString().slice(-6)}`).toUpperCase().trim(),
      status: 'Success'
    });

    res.status(201).json({
      message: 'Wallet balance adjusted successfully',
      transaction,
      newBalance: retailer.walletBalance
    });
  } catch (error) {
    console.error('Adjust wallet balance error:', error);
    res.status(500).json({ message: 'Error processing wallet adjustment' });
  }
};

// POST toggle freeze/unlock wallet
export const toggleWalletFreezeStatus = async (req, res) => {
  try {
    const { retailerId } = req.params;

    const retailer = await Retailer.findById(retailerId);
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    retailer.isWalletFrozen = !retailer.isWalletFrozen;
    await retailer.save();

    res.json({
      message: `Wallet ${retailer.isWalletFrozen ? 'frozen' : 'unblocked'} successfully`,
      isWalletFrozen: retailer.isWalletFrozen,
      storeName: retailer.storeName
    });
  } catch (error) {
    console.error('Toggle wallet freeze status error:', error);
    res.status(500).json({ message: 'Error updating wallet freeze status' });
  }
};

// GET wallet details for a specific retailer (dynamic data)
export const getRetailerWallet = async (req, res) => {
  try {
    const { retailerId } = req.params;

    const retailer = await Retailer.findById(retailerId).select(
      'walletBalance cashbackBalance voucherBalance giftPoints profitSharing activeCards isWalletFrozen storeName name'
    );
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    // Fetch recent transactions for this retailer
    const transactions = await WalletTransaction.find({ retailerId })
      .sort({ createdAt: -1 })
      .limit(20);

    // Count active vouchers
    const now = new Date();
    const activeVouchers = await Voucher.countDocuments({
      status: 'Active',
      validFrom: { $lte: now },
      validTo: { $gte: now }
    });

    // Parse numeric wallet balance
    const balanceStr = retailer.walletBalance || 'Rs 0';
    const numericBalance = parseFloat(balanceStr.replace(/[^0-9.-]+/g, '')) || 0;

    res.json({
      balance: numericBalance,
      balanceFormatted: retailer.walletBalance,
      cashback: retailer.cashbackBalance || 0,
      vouchers: retailer.voucherBalance || 0,
      giftPoints: retailer.giftPoints || 0,
      profitSharing: {
        tier1: retailer.profitSharing?.tier1 || 0,
        tier2: retailer.profitSharing?.tier2 || 0,
        tier3: retailer.profitSharing?.tier3 || 0,
        total: (retailer.profitSharing?.tier1 || 0) + (retailer.profitSharing?.tier2 || 0) + (retailer.profitSharing?.tier3 || 0)
      },
      activeCards: retailer.activeCards || 0,
      activeVouchers,
      isWalletFrozen: retailer.isWalletFrozen,
      transactions: transactions.map(t => ({
        _id: t._id,
        transactionType: t.transactionType,
        amount: t.amount,
        reason: t.reason,
        referenceId: t.referenceId,
        status: t.status,
        createdAt: t.createdAt
      }))
    });
  } catch (error) {
    console.error('Get retailer wallet error:', error);
    res.status(500).json({ message: 'Error fetching retailer wallet data' });
  }
};
