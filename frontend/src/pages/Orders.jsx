import { useState, useEffect } from 'react'
import { Package, Clock, ChevronRight, Filter, Search } from 'lucide-react'

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5200';
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
  return 'http://localhost:5200';
}

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`
}

function Orders() {
  const [activeTab, setActiveTab] = useState('active')
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const retailerData = JSON.parse(localStorage.getItem('umeed-retailer') || '{}')
        const retailerId = retailerData.id || retailerData._id
        if (!retailerId) {
          setIsLoading(false)
          return
        }

        const res = await fetch(`${getBackendUrl()}/api/v1/orders?retailerId=${retailerId}`)
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const activeOrders = orders.filter(o => !['Delivered', 'Rejected', 'Failed'].includes(o.status))
  const historyOrders = orders.filter(o => ['Delivered', 'Rejected', 'Failed'].includes(o.status))

  const currentOrders = activeTab === 'active' ? activeOrders : historyOrders

  return (
    <div className="pb-4 px-4 pt-4 bg-[#F8FAFC] min-h-full">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Your Orders</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Track wholesale shipments</p>
        </div>
        <button className="h-12 w-12 grid place-items-center bg-white rounded-2xl shadow-sm border border-slate-100">
          <Filter size={20} className="text-slate-600" />
        </button>
      </header>

      {/* TABS */}
      <div className="flex bg-slate-100 p-1.5 rounded-[20px] mb-8">
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'active' ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}
        >
          Active
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'history' ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}
        >
          History
        </button>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-5 pb-20">
        {isLoading ? (
          <div className="text-center py-10 text-slate-400 font-medium">Loading orders...</div>
        ) : currentOrders.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium">No {activeTab} orders found.</div>
        ) : (
          currentOrders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })
            // Use the first item's name or a summary if multiple
            const mainItem = order.items && order.items.length > 0 ? order.items[0].name : 'Products'
            const extraItems = order.items && order.items.length > 1 ? ` +${order.items.length - 1} more` : ''
            const displayItem = `${mainItem}${extraItems}`
            
            // Total qty
            const totalQty = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

            return (
              <div key={order._id} className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-50 group active:scale-[0.98] transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-slate-50 rounded-2xl grid place-items-center text-black">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">{order._id.substring(order._id.length - 8).toUpperCase()}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{date}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
                    order.status === 'Rejected' || order.status === 'Failed' ? 'bg-rose-50 text-rose-600' :
                    order.status === 'Out for Delivery' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-black'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-slate-50 pt-5 mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#0F172A] mb-1 leading-tight">{displayItem}</p>
                      <p className="text-xs text-slate-500 font-medium">Quantity: {totalQty} units</p>
                    </div>
                    <p className="text-xl font-black text-[#0F172A]">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>

                <button className="w-full h-14 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest transition-colors">
                  <Clock size={16} />
                  View Tracking
                  <ChevronRight size={14} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Orders
