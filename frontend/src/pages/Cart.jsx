import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react'
import useCart from '../hooks/useCart'

function formatCurrency(value) {
  return `₹${value.toLocaleString('en-IN')}`
}

function Cart() {
  const { cartItems, totalPrice, increaseQuantity, decreaseQuantity, removeItem } = useCart()

  return (
    <div className="px-4 pt-2 flex flex-col h-full bg-[#F8FAFC]">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Cart</h1>
        <p className="text-[11px] text-slate-400 font-medium">{cartItems.length} items in your list</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 bg-slate-100 rounded-full grid place-items-center text-slate-300 mb-4">
            <ShoppingBag size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-800">Your cart is empty</h2>
          <button className="mt-4 text-xs font-black text-black uppercase tracking-widest underline decoration-2 underline-offset-4">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-10 space-y-2">
          {/* COMPACT ITEMS LIST */}
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-2 border border-slate-100 flex items-center gap-3">
              <div className="h-14 w-14 bg-slate-50 rounded-lg overflow-hidden shrink-0 grid place-items-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="text-slate-200" size={20} />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between h-14">
                <div className="flex items-start justify-between">
                  <h3 className="text-[11px] font-bold text-[#0F172A] truncate pr-1 uppercase tracking-tight">{item.name}</h3>
                  <button onClick={() => removeItem(item.id)} className="text-rose-400 p-1 active:scale-75 transition-transform">
                    <Trash2 size={12} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-black">{formatCurrency(item.price)}</span>
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-2">
                    <button onClick={() => decreaseQuantity(item.id)} className="h-5 w-5 bg-white rounded-md grid place-items-center text-black active:scale-90 transition-transform">
                      <Minus size={10} strokeWidth={4} />
                    </button>
                    <span className="text-[10px] font-black text-black">{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)} className="h-5 w-5 bg-white rounded-md grid place-items-center text-black active:scale-90 transition-transform">
                      <Plus size={10} strokeWidth={4} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPACT STICKY CHECKOUT - MINIMAL VERSION */}
      {cartItems.length > 0 && (() => {
        const retailerData = JSON.parse(localStorage.getItem('umeed-retailer') || '{}');
        const isBillingStaff = retailerData.isStaff && retailerData.staffRole === 'Billing Staff';
        return (
          <div className="fixed bottom-[96px] left-4 right-4 z-40">
            <div className="bg-black text-white rounded-2xl p-4 shadow-xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Payable Amount</span>
                <span className="text-lg font-black tracking-tight">{formatCurrency(totalPrice)}</span>
              </div>
              <button 
                onClick={() => {
                  if (isBillingStaff) {
                    alert("Billing Staff cannot place orders directly. Order draft has been saved & sent to Owner (" + retailerData.name + ") for approval!");
                  } else {
                    alert("Order checkout successfully completed!");
                  }
                }}
                className="h-11 px-6 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 active:scale-95 transition-all"
              >
                {isBillingStaff ? 'Send to Owner for Approval' : 'Checkout'}
                <ArrowRight size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  )
}

export default Cart
