import { getBackendUrl } from '../../utils/api';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'



function formatCurrency(value) {
  return `Rs ${Math.round(value).toLocaleString('en-IN')}`
}

function DeliveryHome() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState(null)

  const deliveryPartner = JSON.parse(localStorage.getItem('umeed-delivery-partner') || '{}')
  const partnerId = deliveryPartner?._id

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all orders assigned to this delivery partner
        const ordersRes = await fetch(`${getBackendUrl()}/api/v1/orders`)
        if (ordersRes.ok) {
          const allOrders = await ordersRes.json()
          // Filter orders assigned to this partner
          const myOrders = partnerId
            ? allOrders.filter(o => {
                const dpId = o.deliveryPartnerId?._id || o.deliveryPartnerId
                return dpId === partnerId
              })
            : []
          setOrders(myOrders)
        }

        // Fetch targets for this partner
        const targetRes = await fetch(`${getBackendUrl()}/api/v1/targets`)
        if (targetRes.ok) {
          const targets = await targetRes.json()
          // Find target for this partner (by partnerId or general)
          const myTarget = targets.find(t => t.partnerId === partnerId) || targets[0] || null
          setTarget(myTarget)
        }
      } catch (err) {
        console.error('Error fetching delivery dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [partnerId])

  // Calculate stats from real orders
  const today = new Date().toISOString().split('T')[0]

  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt).toISOString().split('T')[0]
    return orderDate === today
  })

  const assignedCount = orders.filter(o => ['Pending', 'Approved'].includes(o.status)).length
  const pickedCount = orders.filter(o => ['Packed', 'Out for Delivery'].includes(o.status)).length
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length

  // Today's earnings (commission from delivered orders today)
  const todayDelivered = todayOrders.filter(o => o.status === 'Delivered')
  const todayEarnings = todayDelivered.reduce((sum, o) => {
    // 2% commission on orders <= 2000, 1% on orders > 2000
    const rate = o.totalAmount <= 2000 ? 0.02 : 0.01
    return sum + (o.totalAmount * rate)
  }, 0)

  // This month's earnings
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthOrders = orders.filter(o => {
    const d = new Date(o.createdAt)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && o.status === 'Delivered'
  })
  const monthEarnings = monthOrders.reduce((sum, o) => {
    const rate = o.totalAmount <= 2000 ? 0.02 : 0.01
    return sum + (o.totalAmount * rate)
  }, 0)

  // Daily target
  const dailyTarget = target?.targetAmount || 1800
  const targetAchieved = dailyTarget > 0 ? Math.min(100, Math.round((todayEarnings / dailyTarget) * 100)) : 0

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 py-4 min-h-screen items-center justify-center">
        <div className="h-8 w-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <header className="mb-2">
        <h1 className="text-xl font-semibold text-slate-900">Delivery Dashboard</h1>
        <p className="text-sm text-slate-500">Orders, earnings, and targets</p>
      </header>

      {/* TODAY SNAPSHOT CARD */}
      <section className="bg-black p-5 rounded-[20px] text-white shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Today Snapshot</p>
        <div className="mt-2 flex items-baseline gap-1">
          <p className="text-3xl font-bold">{formatCurrency(todayEarnings)}</p>
        </div>
        <p className="mt-1 text-xs text-gray-400">Net earning from completed drops</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="bg-gray-800/80 rounded-xl px-2 py-3 text-center border border-gray-700/50">
            <p className="text-[10px] uppercase font-medium text-gray-400">Assigned</p>
            <p className="mt-1 text-lg font-semibold">{assignedCount}</p>
          </div>
          <div className="bg-gray-800/80 rounded-xl px-2 py-3 text-center border border-gray-700/50">
            <p className="text-[10px] uppercase font-medium text-gray-400">Picked</p>
            <p className="mt-1 text-lg font-semibold">{pickedCount}</p>
          </div>
          <div className="bg-gray-800/80 rounded-xl px-2 py-3 text-center border border-gray-700/50">
            <p className="text-[10px] uppercase font-medium text-gray-400">Delivered</p>
            <p className="mt-1 text-lg font-semibold">{deliveredCount}</p>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-50">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Quick Access</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage your daily run</p>
          </div>

          <div className="grid gap-2">
            <Link
              to="/delivery/orders"
              className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-100 rounded-xl group active:scale-[0.98] transition-all shadow-sm"
            >
              <span className="text-sm font-medium text-slate-700">Manage Orders</span>
              <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/delivery/earnings"
              className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-100 rounded-xl group active:scale-[0.98] transition-all shadow-sm"
            >
              <span className="text-sm font-medium text-slate-700">Earnings & Commission</span>
              <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* PERFORMANCE HIGHLIGHTS */}
      <section className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-50">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Performance Highlights</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tracking your targets</p>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 border border-slate-50 rounded-xl bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">Daily Target</span>
              <span className="text-sm font-semibold text-slate-900">{formatCurrency(dailyTarget)}</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-slate-50 rounded-xl bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">Target Achieved</span>
              <span className={`text-sm font-bold ${targetAchieved >= 100 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {targetAchieved}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 border border-slate-50 rounded-xl bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">This Month</span>
              <span className="text-sm font-semibold text-slate-900">{formatCurrency(monthEarnings)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DeliveryHome
