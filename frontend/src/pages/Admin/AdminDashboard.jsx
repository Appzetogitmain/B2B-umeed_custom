import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const quickModules = [
  { title: 'Retailer Management', path: '/admin/retailers', icon: '' },
  { title: 'Delivery Partners', path: '/admin/delivery-partners', icon: '' },
  { title: 'Product Pricing', path: '/admin/products-pricing', icon: '' },
  { title: 'Order Management', path: '/admin/order-management', icon: '' },
  { title: 'Commission', path: '/admin/commission', icon: '' },
  { title: 'Cashback & Voucher', path: '/admin/cashback-voucher', icon: '' },
  { title: 'Wallet System', path: '/admin/wallet-system', icon: '' },
  { title: 'Payments & Reports', path: '/admin/payments-reports', icon: '' },
]

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    kpiCards: [],
    revenueTrend: [],
    topRetailers: [],
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('http://localhost:5200/api/v1/dashboard/stats');
        const data = await response.json();
        
        if (response.ok) {
          setDashboardData({
            kpiCards: [
              { title: 'Total Revenue', value: data.kpis.totalRevenue, delta: data.kpis.revenueDelta || '0%', icon: '', link: '/admin/payments-reports' },
              { title: 'Total Orders', value: data.kpis.totalOrders, delta: data.kpis.ordersDelta || '0%', icon: '', link: '/admin/order-management' },
              { title: 'Active Retailers', value: data.kpis.activeRetailers, delta: data.kpis.retailersDelta || '0%', icon: '', link: '/admin/retailers' },
              { title: 'Avg Revenue', value: data.kpis.avgRevenue, delta: data.kpis.avgDelta || '0%', icon: '', link: '/admin/payments-reports' },
            ],
            revenueTrend: data.revenueTrend,
            topRetailers: data.topRetailers,
            recentOrders: data.recentOrders
          });
        } else {
          setError(data.message || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        setError('Server error, could not fetch dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  const trendMax = Math.max(...dashboardData.revenueTrend.map(t => t.amount), 1);
  const xPoints = [20, 120, 220, 320, 420, 520, 640];
  const points = dashboardData.revenueTrend.map((t, i) => {
    const x = xPoints[i] || xPoints[xPoints.length - 1];
    const y = 220 - ((t.amount / trendMax) * 190);
    return [x, y, t];
  });
  const pointsString = points.map(p => `${p[0]},${p[1]}`).join(' ');

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardData.kpiCards.map((card) => (
          <Link key={card.title} to={card.link} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="mt-2 text-xl font-semibold text-gray-700">{card.value}</p>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${card.delta.startsWith('-') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{card.delta}</p>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-700">Revenue Trend</h2>
          <p className="mt-1 text-sm text-gray-600">Last 7 days performance</p>
          <div className="mt-6 relative">
            <svg viewBox="0 0 680 260" className="h-56 w-full" aria-hidden="true">
              <defs>
                <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 0.1 }} />
                  <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {xPoints.map((x) => (
                <line key={`grid-${x}`} x1={x} y1="10" x2={x} y2="230" stroke="#e5e7eb" strokeWidth="1" />
              ))}
              {/* Main line */}
              <polyline points={pointsString || "20,220"} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinejoin="round" />
              {/* Points */}
              {points.map(([x, y, t], idx) => (
                <g key={`point-${idx}`}>
                  <circle cx={x} cy={y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  {/* Tooltip-like text can be added here if needed, but for now just the dots */}
                  {t && t.amount > 0 && <text x={x} y={y - 10} fontSize="10" fill="#6b7280" textAnchor="middle">Rs {t.amount}</text>}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Top Retailers */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-700">Top Retailers</h2>
          <p className="mt-1 text-sm text-gray-600">By monthly sales volume</p>
          <div className="mt-6 space-y-4">
            {dashboardData.topRetailers.map((retailer, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">{retailer.name}</p>
                  <p className="text-sm font-semibold text-gray-700">{retailer.sales}</p>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${retailer.progress}%` }}></div>
                </div>
              </div>
            ))}
            {dashboardData.topRetailers.length === 0 && (
              <p className="text-sm text-gray-500">No retailers found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-700">Recent Orders</h2>
            <p className="mt-1 text-sm text-gray-600">Latest transactions from retailers</p>
          </div>
          <Link to="/admin/order-management" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            View All
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Order ID</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Retailer</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{order.id}</td>
                  <td className="px-4 py-3 text-gray-700">{order.retailer}</td>
                  <td className="px-4 py-3 font-semibold text-gray-700">{order.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === 'Completed' || order.status === 'Delivered' || order.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.date}</td>
                </tr>
              ))}
              {dashboardData.recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No recent orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Management Control Center */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-700">Management Control Center</h2>
          <p className="mt-1 text-sm text-gray-600">Quick access to key management modules</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickModules.map((module) => (
            <Link
              key={module.title}
              to={module.path}
              className="group rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-white hover:border-gray-400"
            >
              <p className="text-lg mb-1">{module.icon}</p>
              {module.title}
            </Link>
          ))}
        </div>
      </div>


    </div>
  )
}

export default AdminDashboard
