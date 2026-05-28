import { useState, useEffect } from 'react'

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5200';
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
  return 'http://localhost:5200';
}

function DeliveryPerformance() {
  const [orders, setOrders] = useState([])
  const [target, setTarget] = useState(null)
  const [loading, setLoading] = useState(true)

  const deliveryPartner = JSON.parse(localStorage.getItem('umeed-delivery-partner') || '{}')
  const partnerId = deliveryPartner?._id

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, targetRes] = await Promise.all([
          fetch(`${getBackendUrl()}/api/v1/orders`),
          fetch(`${getBackendUrl()}/api/v1/targets`)
        ])

        if (ordersRes.ok) {
          const allOrders = await ordersRes.json()
          const myDelivered = partnerId
            ? allOrders.filter(o => {
                const dpId = o.deliveryPartnerId?._id || o.deliveryPartnerId
                return dpId === partnerId && o.status === 'Delivered'
              })
            : []
          setOrders(myDelivered)
        }

        if (targetRes.ok) {
          const targets = await targetRes.json()
          const myTarget = targets.find(t => t.partnerId === partnerId) || targets[0] || null
          setTarget(myTarget)
        }
      } catch (err) {
        console.error('Error fetching performance data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [partnerId])

  // Commission calculation
  const getCommission = (orderAmount) => {
    const rate = orderAmount <= 2000 ? 0.02 : 0.01
    return orderAmount * rate
  }
  const deliveryChargePerOrder = 30
  const getEarning = (order) => deliveryChargePerOrder + getCommission(order.totalAmount)

  // Today's earnings
  const today = new Date().toISOString().split('T')[0]
  const todayOrders = orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === today)
  const todayEarning = todayOrders.reduce((sum, o) => sum + getEarning(o), 0)

  // This month's earnings
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const monthOrders = orders.filter(o => {
    const d = new Date(o.createdAt)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  const monthEarning = monthOrders.reduce((sum, o) => sum + getEarning(o), 0)

  // Last 6 days earnings
  const dailyStats = []
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayOrders = orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === dateStr)
    const dayEarning = dayOrders.reduce((sum, o) => sum + getEarning(o), 0)
    dailyStats.push({
      day: dayNames[d.getDay()],
      earning: Math.round(dayEarning)
    })
  }

  const weekTotal = dailyStats.reduce((sum, item) => sum + item.earning, 0)

  // Targets
  const dailyTarget = target?.targetAmount || 1800
  const monthlyTarget = dailyTarget * 30

  const dailyProgress = dailyTarget > 0 ? Math.min(100, Math.round((todayEarning / dailyTarget) * 100)) : 0
  const monthlyProgress = monthlyTarget > 0 ? Math.min(100, Math.round((monthEarning / monthlyTarget) * 100)) : 0

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 py-4 min-h-screen items-center justify-center">
        <div className="h-8 w-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Loading performance...</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <header className="mb-2">
        <h1 className="text-xl font-semibold text-slate-900">Performance</h1>
        <p className="text-sm text-slate-500">Daily and monthly earning targets</p>
      </header>

      {/* STATS CARDS */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
          <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">Daily Earnings</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">Rs {Math.round(todayEarning).toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-slate-500">Target: Rs {dailyTarget.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
          <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">Monthly Earnings</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">Rs {Math.round(monthEarning).toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-slate-500">Target: Rs {monthlyTarget.toLocaleString('en-IN')}</p>
        </div>
      </section>

      {/* TARGET TRACKING */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
        <h3 className="text-base font-semibold text-slate-900">Target Tracking</h3>

        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-600">
              <span>Daily Target Completion</span>
              <span>{dailyProgress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-black transition-all" style={{ width: `${dailyProgress}%` }} />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-600">
              <span>Monthly Target Completion</span>
              <span>{monthlyProgress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-black transition-all" style={{ width: `${monthlyProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* LAST 6 DAYS */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
        <h3 className="text-base font-semibold text-slate-900">Last 6 Days Earnings</h3>

        <div className="mt-4 space-y-3">
          {dailyStats.map((item, idx) => {
            const width = dailyTarget > 0 ? Math.max(4, Math.round((item.earning / dailyTarget) * 100)) : 4

            return (
              <div key={idx} className="grid grid-cols-[42px_1fr_70px] items-center gap-2 text-sm">
                <span className="font-medium text-slate-700">{item.day}</span>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-black transition-all" style={{ width: `${Math.min(100, width)}%` }} />
                </div>
                <span className="text-right font-semibold text-slate-800">Rs {item.earning.toLocaleString('en-IN')}</span>
              </div>
            )
          })}
        </div>

        <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">
          <p className="font-medium text-slate-800">Weekly Total</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">Rs {weekTotal.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  )
}

export default DeliveryPerformance
