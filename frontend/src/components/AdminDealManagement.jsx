import { getBackendUrl } from '../utils/api';
import { useState, useEffect } from 'react';

function AdminDealManagement() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const token = localStorage.getItem('umeed-admin-token');
      const res = await fetch(`${getBackendUrl()}/api/v1/deals/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDeals(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDeal = async (id, status, counterRate, counterQuantity) => {
    try {
      const token = localStorage.getItem('umeed-admin-token');
      const res = await fetch(`${getBackendUrl()}/api/v1/deals/${id}/admin-respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, counterRate, counterQuantity })
      });
      if (res.ok) {
        fetchDeals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading deals...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Pending Deals</h3>
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold">Retailer</th>
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">Requested Rate</th>
              <th className="p-4 font-semibold">Quantity</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deals.length > 0 ? deals.map((deal) => (
              <tr key={deal._id} className="hover:bg-slate-50">
                <td className="p-4">
                  <p className="font-bold">{deal.retailerId?.storeName}</p>
                  <p className="text-xs text-slate-500">{deal.retailerId?.phone}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={deal.productId?.images?.[0]?.startsWith('http') ? deal.productId.images[0] : (deal.productId?.images?.[0] ? `${getBackendUrl()}${deal.productId.images[0]}` : 'https://via.placeholder.com/150')} className="w-10 h-10 rounded-md object-cover" alt="" />
                    <div>
                      <p className="font-semibold">{deal.productId?.name}</p>
                      <p className="text-xs text-slate-500">MRP: ₹{deal.productId?.mrp}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-bold text-emerald-600">₹{deal.requestedRate}</td>
                <td className="p-4 font-semibold">{deal.requestedQuantity} Units</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                    deal.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    deal.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                    deal.status === 'COUNTERED' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {deal.status}
                  </span>
                </td>
                <td className="p-4">
                  {deal.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateDeal(deal._id, 'ACCEPTED')} className="px-3 py-1.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 text-xs">Accept</button>
                      <button onClick={() => {
                        const counter = prompt('Enter your counter offer rate (₹):', deal.requestedRate);
                        if (counter) handleUpdateDeal(deal._id, 'COUNTERED', Number(counter), deal.requestedQuantity);
                      }} className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-xs">Counter</button>
                      <button onClick={() => handleUpdateDeal(deal._id, 'REJECTED')} className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 text-xs">Reject</button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">No action needed</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="p-8 text-center text-slate-500">No deals found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDealManagement;
