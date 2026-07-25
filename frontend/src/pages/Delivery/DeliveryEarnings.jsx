import { useState, useEffect } from 'react'

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return `${getBackendUrl()}`;
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
  return `${getBackendUrl()}`;
}

function formatCurrency(value) {
  return `Rs ${Math.round(value).toLocaleString('en-IN')}`
}

function DeliveryEarnings() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const deliveryPartner = JSON.parse(localStorage.getItem('umeed-delivery-partner') || '{}')
  const partnerId = deliveryPartner?._id

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${getBackendUrl()}/api/v1/orders`)
        if (res.ok) {
          const allOrders = await res.json()
          // Filter delivered orders assigned to this partner
          const myDelivered = partnerId
            ? allOrders.filter(o => {
                const dpId = o.deliveryPartnerId?._id || o.deliveryPartnerId
                return dpId === partnerId && o.status === 'Delivered'
              })
            : []
          setOrders(myDelivered)
        }
      } catch (err) {
        console.error('Error fetching earnings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [partnerId])

  // Calculate earnings from real orders
  // Commission: 2% on orders <= 2000, 1% on orders > 2000
  const getCommissionRate = (orderValue) => orderValue <= 2000 ? 0.02 : 0.01
  const calculateCommission = (orderValue) => orderValue * getCommissionRate(orderValue)

  // Delivery charge: based on order amount (flat Rs 30 per delivery for simplicity, or can be dynamic)
  const deliveryChargePerOrder = 30

  const totals = orders.reduce(
    (acc, order) => {
      const deliveryCharge = deliveryChargePerOrder
      const commission = calculateCommission(order.totalAmount)
      const net = deliveryCharge + commission // partner earns delivery charge + commission

      return {
        deliveryCharge: acc.deliveryCharge + deliveryCharge,
        commission: acc.commission + commission,
        net: acc.net + net,
      }
    },
    { deliveryCharge: 0, commission: 0, net: 0 },
  )

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 py-4 min-h-screen items-center justify-center">
        <div className="h-8 w-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Loading earnings...</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <header className="mb-2">
        <h1 className="text-xl font-semibold text-slate-900">Earnings</h1>
        <p className="text-sm text-slate-500">Delivery charges and commission tracking</p>
      </header>

      {/* NET PAYOUT */}
      <section className="bg-black rounded-2xl p-5 text-white shadow-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">Net Payout</p>
        <p className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.01em]">{formatCurrency(totals.net)}</p>
        <p className="mt-2 text-xs text-gray-400">Delivery charge (Rs {deliveryChargePerOrder}/order) + Commission (2% or 1%)</p>
      </section>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Delivery Charges</p>
          <p className="mt-1 text-base font-semibold text-slate-800">{formatCurrency(totals.deliveryCharge)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Commission Earned</p>
          <p className="mt-1 text-base font-semibold text-emerald-600">{formatCurrency(totals.commission)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Delivered Orders</p>
          <p className="mt-1 text-base font-semibold text-slate-800">{orders.length}</p>
        </div>
      </div>

      {/* COMMISSION TRACKING TABLE */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
        <h3 className="text-base font-semibold text-slate-900">Commission Tracking</h3>
        <p className="text-xs text-slate-500 mt-1">2% on orders up to Rs 2,000 and 1% above Rs 2,000</p>

        {orders.length === 0 ? (
          <div className="mt-4 text-center py-6">
            <p className="text-sm text-slate-400">No delivered orders yet</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[400px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 font-semibold text-slate-800">Order</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-800">Amount</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-800">Delivery</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-800">Commission</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-800">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const commission = calculateCommission(order.totalAmount)
                  const rate = getCommissionRate(order.totalAmount)
                  const total = deliveryChargePerOrder + commission
                  const orderId = order._id.substring(order._id.length - 6).toUpperCase()

                  return (
                    <tr key={order._id}>
                      <td className="px-3 py-3 text-slate-700 font-medium">{orderId}</td>
                      <td className="px-3 py-3 text-slate-700">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-3 font-medium text-slate-800">{formatCurrency(deliveryChargePerOrder)}</td>
                      <td className="px-3 py-3 text-emerald-600">+{formatCurrency(commission)} ({Math.round(rate * 100)}%)</td>
                      <td className="px-3 py-3 font-semibold text-slate-800">{formatCurrency(total)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryEarnings
