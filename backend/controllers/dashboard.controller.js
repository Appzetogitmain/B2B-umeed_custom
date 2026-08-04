import Order from '../models/Order.js';
import Retailer from '../models/Retailer.js';
import WalletTransaction from '../models/WalletTransaction.js';

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // === CURRENT PERIOD (last 7 days) ===
    const thisWeekStart = new Date();
    thisWeekStart.setDate(now.getDate() - 6);
    thisWeekStart.setHours(0, 0, 0, 0);

    // === PREVIOUS PERIOD (7 days before that) ===
    const lastWeekStart = new Date();
    lastWeekStart.setDate(now.getDate() - 13);
    lastWeekStart.setHours(0, 0, 0, 0);
    const lastWeekEnd = new Date(thisWeekStart);

    // 1. Basic KPIs
    const totalOrdersCount = await Order.countDocuments({ status: { $ne: 'Rejected' } });

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Rejected' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const avgRevenue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    const activeRetailersCount = await Retailer.countDocuments({ status: 'Active' });

    // === DELTA CALCULATIONS (this week vs last week) ===
    // This week revenue & orders
    const thisWeekStats = await Order.aggregate([
      { $match: { status: { $ne: 'Rejected' }, createdAt: { $gte: thisWeekStart } } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } }
    ]);
    const thisWeekRevenue = thisWeekStats.length > 0 ? thisWeekStats[0].revenue : 0;
    const thisWeekOrders = thisWeekStats.length > 0 ? thisWeekStats[0].orders : 0;

    // Last week revenue & orders
    const lastWeekStats = await Order.aggregate([
      { $match: { status: { $ne: 'Rejected' }, createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd } } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } }
    ]);
    const lastWeekRevenue = lastWeekStats.length > 0 ? lastWeekStats[0].revenue : 0;
    const lastWeekOrders = lastWeekStats.length > 0 ? lastWeekStats[0].orders : 0;

    // Retailers delta (joined this week vs last week)
    const retailersThisWeek = await Retailer.countDocuments({ status: 'Active', createdAt: { $gte: thisWeekStart } });
    const retailersLastWeek = await Retailer.countDocuments({ status: 'Active', createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd } });

    // Calculate percentage deltas
    const calcDelta = (current, previous) => {
      if (previous === 0 && current === 0) return '0%';
      if (previous === 0) return '+100%';
      const delta = ((current - previous) / previous) * 100;
      const sign = delta >= 0 ? '+' : '';
      return `${sign}${delta.toFixed(1)}%`;
    };

    const revenueDelta = calcDelta(thisWeekRevenue, lastWeekRevenue);
    const ordersDelta = calcDelta(thisWeekOrders, lastWeekOrders);
    const retailersDelta = calcDelta(retailersThisWeek, retailersLastWeek);

    // Avg revenue delta
    const thisWeekAvg = thisWeekOrders > 0 ? Math.round(thisWeekRevenue / thisWeekOrders) : 0;
    const lastWeekAvg = lastWeekOrders > 0 ? Math.round(lastWeekRevenue / lastWeekOrders) : 0;
    const avgDelta = calcDelta(thisWeekAvg, lastWeekAvg);

    // 2. Revenue Trend (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trendResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'Rejected' },
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing days with 0
    const revenueTrend = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const found = trendResult.find(t => t._id === dateStr);
      revenueTrend.push({
        date: dateStr,
        amount: found ? found.amount : 0
      });
    }

    // 3. Top Retailers
    const topRetailersResult = await Order.aggregate([
      { $match: { status: { $ne: 'Rejected' } } },
      { $group: { _id: '$retailerId', totalSales: { $sum: '$totalAmount' } } },
      { $sort: { totalSales: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'retailers',
          localField: '_id',
          foreignField: '_id',
          as: 'retailerData'
        }
      },
      { $unwind: '$retailerData' },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ['$retailerData.storeName', '$retailerData.name'] },
          totalSales: 1
        }
      }
    ]);

    // Calculate progress % based on max sales
    const maxSales = topRetailersResult.length > 0 ? topRetailersResult[0].totalSales : 1;
    const topRetailers = topRetailersResult.map(r => ({
      name: r.name || 'Unknown Retailer',
      sales: `Rs ${r.totalSales.toLocaleString()}`,
      progress: Math.round((r.totalSales / maxSales) * 100) || 0
    }));

    // 4. Recent Orders
    const recentOrdersDb = await Order.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('retailerId', 'name storeName');

    const recentOrders = recentOrdersDb.map(order => {
      // rough time ago logic
      const diffMs = now - new Date(order.createdAt);
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const timeStr = diffHrs > 0 ? `${diffHrs} hours ago` : 'Just now';

      return {
        id: order._id.toString().substring(order._id.toString().length - 4).toUpperCase(), // short ID
        retailer: order.retailerId ? (order.retailerId.storeName || order.retailerId.name) : 'Unknown',
        amount: `Rs ${order.totalAmount.toLocaleString()}`,
        status: order.status,
        date: timeStr
      };
    });

    res.json({
      kpis: {
        totalRevenue: `Rs ${totalRevenue.toLocaleString()}`,
        totalOrders: totalOrdersCount.toString(),
        activeRetailers: activeRetailersCount.toString(),
        avgRevenue: `Rs ${avgRevenue.toLocaleString()}`,
        revenueDelta,
        ordersDelta,
        retailersDelta,
        avgDelta
      },
      revenueTrend,
      topRetailers,
      recentOrders
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};


// GET earning analytics for a specific retailer
export const getRetailerEarningAnalytics = async (req, res) => {
  try {
    const { retailerId } = req.params;

    const retailer = await Retailer.findById(retailerId).select(
      'walletBalance cashbackBalance voucherBalance giftPoints profitSharing activeCards name storeName'
    );
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    // Parse numeric wallet balance
    const balanceStr = retailer.walletBalance || 'Rs 0';
    const totalBalance = parseFloat(balanceStr.replace(/[^0-9.-]+/g, '')) || 0;

    // Total orders & spending for this retailer
    const orderStats = await Order.aggregate([
      { $match: { retailerId: retailer._id, status: { $ne: 'Rejected' } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = orderStats.length > 0 ? orderStats[0].totalOrders : 0;
    const totalSpent = orderStats.length > 0 ? orderStats[0].totalSpent : 0;
    const avgOrderValue = orderStats.length > 0 ? Math.round(orderStats[0].avgOrderValue) : 0;

    // Monthly earning trend (last 6 months) from wallet transactions
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrend = await WalletTransaction.aggregate([
      {
        $match: {
          retailerId: retailer._id,
          transactionType: 'Credit',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          earned: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing months
    const earningTrend = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const found = monthlyTrend.find(t => t._id === key);
      earningTrend.push({
        month: d.toLocaleString('en-IN', { month: 'short' }),
        year: d.getFullYear(),
        earned: found ? found.earned : 0
      });
    }

    // Total credits & debits
    const creditDebitStats = await WalletTransaction.aggregate([
      { $match: { retailerId: retailer._id } },
      {
        $group: {
          _id: '$transactionType',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalCredits = 0, totalDebits = 0, creditCount = 0, debitCount = 0;
    creditDebitStats.forEach(s => {
      if (s._id === 'Credit') { totalCredits = s.total; creditCount = s.count; }
      if (s._id === 'Debit') { totalDebits = s.total; debitCount = s.count; }
    });

    // Recent transactions (last 10)
    const recentTransactions = await WalletTransaction.find({ retailerId: retailer._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Profit sharing breakdown
    const profitSharing = retailer.profitSharing || { tier1: 0, tier2: 0, tier3: 0 };
    const totalProfitSharing = (profitSharing.tier1 || 0) + (profitSharing.tier2 || 0) + (profitSharing.tier3 || 0);

    res.json({
      overview: {
        totalBalance,
        cashback: retailer.cashbackBalance || 0,
        vouchers: retailer.voucherBalance || 0,
        giftPoints: retailer.giftPoints || 0,
        activeCards: retailer.activeCards || 0,
      },
      orderStats: {
        totalOrders,
        totalSpent,
        avgOrderValue
      },
      profitSharing: {
        tier1: profitSharing.tier1 || 0,
        tier2: profitSharing.tier2 || 0,
        tier3: profitSharing.tier3 || 0,
        total: totalProfitSharing
      },
      transactionSummary: {
        totalCredits,
        totalDebits,
        creditCount,
        debitCount,
        netEarnings: totalCredits - totalDebits
      },
      earningTrend,
      recentTransactions: recentTransactions.map(t => ({
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
    console.error('Error fetching retailer earning analytics:', error);
    res.status(500).json({ message: 'Server error fetching earning analytics' });
  }
};
