import Order from '../models/Order.js';
import Retailer from '../models/Retailer.js';

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    
    // 1. Basic KPIs
    const totalOrdersCount = await Order.countDocuments({ status: { $ne: 'Rejected' } });
    
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Rejected' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const avgRevenue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
    
    const activeRetailersCount = await Retailer.countDocuments({ status: 'Active' });

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
          name: '$retailerData.businessName',
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
      .populate('retailerId', 'businessName');

    const recentOrders = recentOrdersDb.map(order => {
      // rough time ago logic
      const diffMs = now - new Date(order.createdAt);
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const timeStr = diffHrs > 0 ? `${diffHrs} hours ago` : 'Just now';

      return {
        id: order._id.toString().substring(order._id.toString().length - 4).toUpperCase(), // short ID
        retailer: order.retailerId ? order.retailerId.businessName : 'Unknown',
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
        avgRevenue: `Rs ${avgRevenue.toLocaleString()}`
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
