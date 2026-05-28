import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Clock, MapPin, CreditCard, Truck } from 'lucide-react'

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5200';
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
  return 'http://localhost:5200';
}

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`
}

function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${getBackendUrl()}/api/v1/orders/${id}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
        }
      } catch (err) {
        console.error('Error fetching order:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="pb-4 px-4 pt-4 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Loading order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="pb-4 px-4 pt-4 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-slate-500 font-medium">Order not found</p>
          <button onClick={() => navigate('/retailer/orders')} className="mt-4 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold">
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const orderId = order._id.substring(order._id.length - 8).toUpperCase()
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const subtotal = order.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0
  const totalItems = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-600'
      case 'Rejected':
      case 'Failed': return 'bg-rose-50 text-rose-600'
      case 'Out for Delivery': return 'bg-amber-50 text-amber-600'
      case 'Packed': return 'bg-blue-50 text-blue-600'
      default: return 'bg-slate-100 text-black'
    }
  }

  return (
    <div className="pb-32 px-4 pt-4 bg-[#F8FAFC] min-h-screen">
      {/* HEADER */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/retailer/orders')}
          className="h-12 w-12 grid place-items-center bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Order Details</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">#{orderId}</p>
        </div>
      </header>

      {/* ORDER STATUS CARD */}
      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-slate-50 rounded-2xl grid place-items-center">
              <Package size={22} className="text-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">#{orderId}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{orderDate}</p>
            </div>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        {order.rejectionReason && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3 mt-3">
            <p className="text-xs text-rose-600 font-medium">Reason: {order.rejectionReason}</p>
          </div>
        )}
      </section>

      {/* ITEMS */}
      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 mb-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Items ({totalItems} units)</h3>
        <div className="space-y-4">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
              <div className="h-14 w-14 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-100">
                {item.product?.images?.[0] ? (
                  <img src={item.product.images[0]} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-slate-300">
                    <Package size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#0F172A] truncate">{item.name}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Qty: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <p className="text-sm font-black text-[#0F172A]">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENT INFO */}
      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 mb-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Payment Info</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Method</span>
            </div>
            <span className="text-xs font-bold text-[#0F172A]">
              {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod === 'Online' ? 'Online (Razorpay)' : order.paymentMethod}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Payment Status</span>
            </div>
            <span className={`text-xs font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {order.paymentStatus}
            </span>
          </div>
          {order.transactionId && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Transaction ID</span>
              <span className="text-xs font-bold text-[#0F172A]">{order.transactionId}</span>
            </div>
          )}
        </div>
      </section>

      {/* DELIVERY INFO */}
      {order.deliveryPartnerId && (
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 mb-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Delivery Partner</h3>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 rounded-xl grid place-items-center">
              <Truck size={18} className="text-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">{order.deliveryPartnerId.name || 'Assigned'}</p>
              {order.deliveryPartnerId.phone && (
                <p className="text-[10px] text-slate-400 font-medium">{order.deliveryPartnerId.phone}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PRICE BREAKDOWN */}
      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Price Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Subtotal</span>
            <span className="text-xs font-bold text-[#0F172A]">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-sm font-black text-[#0F172A]">Total Amount</span>
            <span className="text-xl font-black text-[#0F172A]">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OrderDetail
