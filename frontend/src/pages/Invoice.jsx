import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBackendUrl } from '../utils/api';

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${getBackendUrl()}/api/v1/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error('Error fetching order for invoice:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!loading && order) {
      // Add a tiny delay to ensure images/fonts load before print dialog
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, order]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white print:hidden">
        <p className="text-slate-500 font-medium">Generating Invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white print:hidden">
        <p className="text-slate-500 font-medium mb-4">Invoice not found or invalid order.</p>
        <button onClick={() => window.close()} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold">
          Close Window
        </button>
      </div>
    );
  }

  const orderId = order._id.toUpperCase();
  const shortOrderId = orderId.slice(-8);
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const subtotal = order.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  
  const totalDeliveryFee = order.items?.reduce((acc, item) => acc + ((item.deliveryFee || 0) * item.quantity), 0) || 0;
  const totalPlatformFee = order.items?.reduce((acc, item) => acc + ((item.platformFee || 0) * item.quantity), 0) || 0;
  const totalGST = order.items?.reduce((acc, item) => {
    const gstAmt = item.gstAmount !== undefined ? item.gstAmount : (item.price * ((item.gst || 0) / 100));
    return acc + (gstAmt * item.quantity);
  }, 0) || 0;

  const totalDiscount = order.items?.reduce((acc, item) => {
    const itemTotalMRP = item.mrp * item.quantity;
    const itemTotalSelling = item.price * item.quantity;
    return acc + (itemTotalMRP - itemTotalSelling);
  }, 0) || 0;

  return (
    <div className="bg-white min-h-screen flex justify-center text-slate-800 font-sans p-4 sm:p-8 print:p-0 print:m-0 print:block">
      
      {/* Hide controls when printing */}
      <div className="fixed top-4 right-4 print:hidden flex gap-3">
        <button 
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Print Invoice
        </button>
        <button 
          onClick={() => {
            if(window.history.length > 1) navigate(-1);
            else window.close();
          }}
          className="px-5 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-200 active:scale-95 transition-all"
        >
          Go Back
        </button>
      </div>

      {/* A4 Size Container */}
      <div className="w-full max-w-[210mm] min-h-[297mm] bg-white sm:border border-slate-200 sm:shadow-lg p-8 sm:p-12 print:border-none print:shadow-none print:p-0 mx-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">INVOICE</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Order #{shortOrderId}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-emerald-600 tracking-tight">UMEED B2B</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">contact@umeedretailers.com</p>
            <p className="text-xs text-slate-500 font-medium">+91 98765 43210</p>
          </div>
        </header>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Billed To</h3>
            <p className="font-bold text-slate-900">{order.retailerId?.storeName || 'Retailer Store'}</p>
            <p className="text-sm text-slate-600">{order.retailerId?.ownerName || order.retailerId?.name}</p>
            <p className="text-sm text-slate-600">{order.retailerId?.deliveryAddress || order.retailerId?.address || 'Address not provided'}</p>
            {order.retailerId?.city && <p className="text-sm text-slate-600">{order.retailerId?.city}</p>}
            <p className="text-sm text-slate-600 mt-2">Phone: <span className="font-medium text-slate-900">{order.retailerId?.phone}</span></p>
            {order.retailerId?.gstNumber && (
              <p className="text-sm text-slate-600">GSTIN: <span className="font-medium text-slate-900">{order.retailerId.gstNumber}</span></p>
            )}
          </div>
          
          <div className="space-y-1 text-right">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Details</h3>
            <div className="flex justify-end gap-4 text-sm">
              <span className="text-slate-500">Invoice Date:</span>
              <span className="font-bold text-slate-900 w-32">{orderDate.split(' at ')[0]}</span>
            </div>
            <div className="flex justify-end gap-4 text-sm">
              <span className="text-slate-500">Order ID:</span>
              <span className="font-bold text-slate-900 w-32 break-all">{orderId}</span>
            </div>
            <div className="flex justify-end gap-4 text-sm">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="font-bold text-slate-900 w-32">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-end gap-4 text-sm">
              <span className="text-slate-500">Payment Status:</span>
              <span className={`font-bold w-32 ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mb-8">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y-2 border-slate-200">
                <th className="py-3 px-4 font-bold text-slate-900 w-12 text-center">#</th>
                <th className="py-3 px-4 font-bold text-slate-900">Item Description</th>
                <th className="py-3 px-4 font-bold text-slate-900 text-right w-24">MRP</th>
                <th className="py-3 px-4 font-bold text-slate-900 text-right w-24">Rate</th>
                <th className="py-3 px-4 font-bold text-slate-900 text-center w-20">Qty</th>
                <th className="py-3 px-4 font-bold text-slate-900 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items?.map((item, index) => (
                <tr key={index} className="break-inside-avoid">
                  <td className="py-4 px-4 text-slate-500 text-center">{index + 1}</td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Retail Profit: {item.discount || 0}% ({formatCurrency((item.mrp - item.price) * item.quantity)})</p>
                  </td>
                  <td className="py-4 px-4 text-right text-slate-500 line-through text-xs">
                    {formatCurrency(item.mrp)}
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-slate-700">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-12 break-inside-avoid">
          <div className="w-72 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            {totalDeliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Delivery Fee</span>
                <span className="font-bold text-slate-900">{formatCurrency(totalDeliveryFee)}</span>
              </div>
            )}
            {totalPlatformFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Platform Fee</span>
                <span className="font-bold text-slate-900">{formatCurrency(totalPlatformFee)}</span>
              </div>
            )}
            {totalGST > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">GST</span>
                <span className="font-bold text-slate-900">{formatCurrency(totalGST)}</span>
              </div>
            )}
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Total Discount Saved</span>
                <span className="font-bold text-emerald-600">-{formatCurrency(totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg border-t-2 border-slate-900 pt-3 mt-3">
              <span className="font-black text-slate-900">Grand Total</span>
              <span className="font-black text-emerald-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-6 text-center break-inside-avoid">
          <h4 className="text-sm font-bold text-slate-900 mb-1">Thank you for your business!</h4>
          <p className="text-xs text-slate-500">If you have any questions about this invoice, please contact us at contact@umeedretailers.com.</p>
          <p className="text-[10px] text-slate-400 mt-4">This is a computer-generated invoice and does not require a physical signature.</p>
        </footer>

      </div>
    </div>
  );
}
