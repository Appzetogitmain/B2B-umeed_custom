import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, CreditCard, Banknote, X, CheckCircle } from 'lucide-react'
import useCart from '../hooks/useCart'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function formatCurrency(value) {
  return `₹${value.toLocaleString('en-IN')}`
}

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5200';
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
  return 'http://localhost:5200';
}

function Cart() {
  const { cartItems, totalPrice, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isCheckoutOpen = searchParams.get('checkout') === 'true'

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)

  const handleSetCheckoutOpen = (isOpen) => {
    if (isOpen) {
      setSearchParams({ checkout: 'true' })
    } else {
      setSearchParams({})
    }
  }

  const retailerData = JSON.parse(localStorage.getItem('umeed-retailer') || '{}');
  const isBillingStaff = retailerData.isStaff && retailerData.staffRole === 'Billing Staff';

  const handlePlaceOrder = async (selectedMethod) => {
    if (isBillingStaff) {
      alert("Billing Staff cannot place orders directly. Order draft has been saved & sent to Owner (" + retailerData.name + ") for approval!");
      return;
    }

    setIsProcessing(true);

    try {
      const retailerId = retailerData.id || retailerData._id;
      if (!retailerId) {
        alert("Session expired or retailer ID not found. Please log in again.");
        setIsProcessing(false);
        window.location.href = '/retailer/auth';
        return;
      }

      const items = cartItems.map(i => ({
        product: i.id,
        quantity: i.quantity,
        price: i.price,
        mrp: i.originalPrice || i.price,
        name: i.name
      }));

      const orderPayload = {
        retailerId,
        items,
        totalAmount: totalPrice,
        status: 'Pending',
        paymentMethod: selectedMethod === 'Razorpay' ? 'Online' : 'COD'
      };

      console.log("Sending order payload:", orderPayload);

      if (selectedMethod === 'COD') {
        const res = await fetch(`${getBackendUrl()}/api/v1/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });

        if (res.ok) {
          setOrderSuccess(true);
          clearCart();
        } else {
          const errData = await res.json().catch(() => ({}));
          console.error("Order failed:", errData);
          alert('Failed to place order: ' + (errData.message || 'Unknown error'));
        }
      } else {
        // Razorpay flow
        const rzpRes = await fetch(`${getBackendUrl()}/api/v1/payments/razorpay/order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalPrice })
        });
        const rzpData = await rzpRes.json();

        if (!rzpData.id) throw new Error('Razorpay Order generation failed');

        const options = {
          key: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_RAZORPAY_KEY_ID) ? import.meta.env.VITE_RAZORPAY_KEY_ID : 'rzp_test_S3IcSS1NbymL6D', // safely access env in Vite
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: "Umeed B2B",
          description: "Order Payment",
          order_id: rzpData.id,
          handler: async function (response) {
            // Payment success - Place actual order
            const orderRes = await fetch(`${getBackendUrl()}/api/v1/orders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                retailerId: retailerData.id || retailerData._id,
                items,
                totalAmount: totalPrice,
                status: 'Pending',
                paymentMethod: 'Online',
                transactionId: response.razorpay_payment_id
              })
            });
            if (orderRes.ok) {
              setOrderSuccess(true);
              clearCart();
            } else {
              const errData = await orderRes.json().catch(() => ({}));
              console.error("Order failed:", errData);
              alert('Failed to place order: ' + (errData.message || 'Unknown error'));
            }
          },
          prefill: {
            name: retailerData.name || "Retailer",
            email: retailerData.email || "retailer@example.com",
            contact: retailerData.phone || "9999999999"
          },
          theme: { color: "#000000" },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert("Payment Failed: " + response.error.description);
          setIsProcessing(false);
        });
        rzp.open();
      }
    } catch (error) {
      console.error(error);
      alert('Error processing checkout');
    } finally {
      setIsProcessing(false);
    }
  }

  // If order is successful, show success screen
  if (orderSuccess) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white h-[100dvh] w-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500 w-full max-w-sm mx-auto">
          {/* Custom Zomato-like Green Tick */}
          <div className="h-32 w-32 bg-[#25a541] rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(37,165,65,0.4)] animate-bounce">
            <svg 
              className="w-16 h-16 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={4} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3 text-center">Order Placed!</h2>
          <p className="text-sm font-medium text-slate-500 mb-10 text-center px-4 leading-relaxed">
            Your order has been successfully confirmed and sent for processing.
          </p>
          <button 
            onClick={() => {
              setOrderSuccess(false);
              setShowPaymentOptions(false);
              window.location.href = '/retailer/home'; // redirect to home
            }}
            className="w-full h-14 bg-black text-white rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center active:scale-[0.98] transition-all shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2 flex flex-col h-full bg-[#F8FAFC] relative">
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
          <button onClick={() => navigate('/retailer/home')} className="mt-4 text-xs font-black text-black uppercase tracking-widest underline decoration-2 underline-offset-4">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-32 space-y-2">
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
      {cartItems.length > 0 && (
        <div className="fixed bottom-[96px] left-4 right-4 z-40">
          <div className="bg-black text-white rounded-2xl p-4 shadow-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Payable Amount</span>
              <span className="text-lg font-black tracking-tight">{formatCurrency(totalPrice)}</span>
            </div>
            <button
              onClick={() => handleSetCheckoutOpen(true)}
              className="h-11 px-6 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 active:scale-95 transition-all"
            >
              Checkout
              <ArrowRight size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* CHECKOUT OVERLAY MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <header className="flex items-center justify-between p-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Checkout</h2>
            <button onClick={() => handleSetCheckoutOpen(false)} className="p-2 bg-slate-100 rounded-full active:scale-90 transition-transform">
              <X size={20} className="text-slate-600" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
            {/* Order Summary with Inc/Dec */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Order Summary</h3>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="flex-1">
                      <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">{item.name}</h4>
                      <span className="text-[11px] font-black text-black">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 gap-2">
                      <button onClick={() => decreaseQuantity(item.id)} className="h-6 w-6 bg-slate-50 rounded-md grid place-items-center text-black active:scale-90">
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="text-[11px] font-black w-3 text-center">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)} className="h-6 w-6 bg-slate-50 rounded-md grid place-items-center text-black active:scale-90">
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <button
              onClick={() => setShowPaymentOptions(true)}
              disabled={isProcessing || cartItems.length === 0}
              className="w-full h-14 bg-black text-white rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Proceed to Pay ${formatCurrency(totalPrice)}`}
            </button>
          </div>

          {/* PAYMENT OPTIONS BOTTOM SHEET */}
          {showPaymentOptions && (
            <div className="absolute inset-0 z-50 flex flex-col justify-end">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowPaymentOptions(false)} />

              {/* Sheet */}
              <div className="relative bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-black text-slate-800 tracking-tight">Select Payment Method</h3>
                  <button onClick={() => setShowPaymentOptions(false)} className="p-1.5 bg-slate-100 rounded-full active:scale-90 transition-transform">
                    <X size={16} className="text-slate-600" />
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handlePlaceOrder('COD')}
                    disabled={isProcessing}
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 flex items-center gap-4 transition-all active:scale-[0.98] bg-white hover:border-slate-300"
                  >
                    <div className="h-12 w-12 bg-slate-50 rounded-xl grid place-items-center">
                      <Banknote size={24} className="text-black" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Cash on Delivery</span>
                      <span className="text-[10px] font-bold text-slate-400">Pay when you receive the order</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePlaceOrder('Razorpay')}
                    disabled={isProcessing}
                    className="w-full p-4 rounded-2xl border-2 border-black bg-black flex items-center gap-4 transition-all active:scale-[0.98]"
                  >
                    <div className="h-12 w-12 bg-white/10 rounded-xl grid place-items-center">
                      <CreditCard size={24} className="text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-black text-white uppercase tracking-tight">Pay Online</span>
                      <span className="text-[10px] font-bold text-white/50">Cards, UPI, Netbanking</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Cart
