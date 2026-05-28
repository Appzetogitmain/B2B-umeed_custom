import { useState, useEffect } from 'react'

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5200';
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
  return 'http://localhost:5200';
}

function getStatusBadge(status) {
  if (status === 'Delivered') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Out for Delivery') return 'bg-blue-100 text-blue-700'
  if (status === 'Packed') return 'bg-purple-100 text-purple-700'
  if (status === 'Approved') return 'bg-amber-100 text-amber-700'
  if (status === 'Rejected') return 'bg-rose-100 text-rose-700'
  return 'bg-slate-100 text-slate-700'
}

function DeliveryOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const deliveryPartner = JSON.parse(localStorage.getItem('umeed-delivery-partner') || '{}')
  const partnerId = deliveryPartner?._id

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${getBackendUrl()}/api/v1/orders`)
      if (res.ok) {
        const allOrders = await res.json()
        const myOrders = partnerId
          ? allOrders.filter(o => {
              const dpId = o.deliveryPartnerId?._id || o.deliveryPartnerId
              return dpId === partnerId
            })
          : []
        setOrders(myOrders)
      }
    } catch (err) {
      console.error('Error fetching delivery orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [partnerId])

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${getBackendUrl()}/api/v1/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        // Refresh orders
        fetchOrders()
      }
    } catch (err) {
      console.error('Error updating order status:', err)
    }
  }

  const openRoute = (address) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    window.open(mapsUrl, '_blank', 'noopener,noreferrer')
  }

  const pendingCount = orders.filter(o => ['Pending', 'Approved', 'Packed'].includes(o.status)).length

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 py-4 min-h-screen items-center justify-center">
        <div className="h-8 w-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <header className="mb-2">
        <h1 className="text-xl font-semibold text-slate-900">Delivery Orders</h1>
        <p className="text-sm text-slate-500">Accept/reject, navigate route, and update live status</p>
      </header>

      <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3">
        <p className="text-sm font-medium text-slate-800">Pending decisions</p>
        <span className="rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white">{pendingCount}</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-50">
          <p className="text-sm text-slate-400">No orders assigned to you yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const retailerName = order.retailerId?.storeName || order.retailerId?.name || 'Retailer'
            const retailerPhone = order.retailerId?.phone || ''
            const retailerAddress = order.retailerId?.deliveryAddress || order.retailerId?.completeAddress || ''
            const orderId = order._id.substring(order._id.length - 8).toUpperCase()
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
            const totalItems = order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0

            return (
              <div key={order._id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{retailerName}</p>
                    <p className="mt-1 text-xs text-slate-500">Order ID: {orderId}</p>
                    {retailerPhone && <p className="mt-0.5 text-xs text-slate-500">{retailerPhone}</p>}
                    {retailerAddress && <p className="mt-0.5 text-xs text-slate-600">{retailerAddress}</p>}
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Items</p>
                    <p className="mt-1 font-semibold text-slate-800">{totalItems} units</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Amount</p>
                    <p className="mt-1 font-semibold text-slate-800">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Date</p>
                    <p className="mt-1 font-semibold text-slate-800">{orderDate}</p>
                  </div>
                </div>

                {/* Action buttons based on status */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {order.status === 'Approved' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'Packed')}
                      className="flex-1 min-w-24 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white active:scale-95 transition-all"
                    >
                      Mark Packed
                    </button>
                  )}
                  {order.status === 'Packed' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                      className="flex-1 min-w-24 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white active:scale-95 transition-all"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === 'Out for Delivery' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'Delivered')}
                      className="flex-1 min-w-24 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white active:scale-95 transition-all"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.status !== 'Delivered' && order.status !== 'Rejected' && (
                    <button
                      onClick={() => openRoute(retailerAddress)}
                      className="flex-1 min-w-32 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 active:scale-95 transition-all"
                    >
                      Route Navigation
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DeliveryOrders
