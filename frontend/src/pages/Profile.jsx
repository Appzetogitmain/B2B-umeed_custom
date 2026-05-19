import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Phone, MapPin, Award, UserPlus, Users, LayoutDashboard, LogOut, ChevronRight, ShieldCheck, Settings, X, Copy, Share2, Plus, Trash2, MessageSquare, Pencil } from 'lucide-react'

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDeliveryRoute = location.pathname.startsWith('/delivery');

  const handleLogout = () => {
    if (isDeliveryRoute) {
      localStorage.removeItem('umeed-delivery-auth');
      navigate('/delivery/auth', { replace: true });
      return;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('umeed-retailer');
    navigate('/retailer/auth', { replace: true });
  };

  const retailerData = JSON.parse(localStorage.getItem('umeed-retailer') || 'null');
  const isStaff = retailerData?.isStaff === true;
  const staffName = retailerData?.staffName || '';
  const staffRole = retailerData?.staffRole || '';
  const displayName = isDeliveryRoute ? 'Nadeem Ahmed' : (isStaff ? staffName : (retailerData?.name || 'Umeed Retailer'));
  const displayId = isDeliveryRoute ? 'DP-44712' : (retailerData?._id ? `RT-${retailerData._id.substring(retailerData._id.length - 6).toUpperCase()}` : 'RT-90817');

  const getInitials = (name) => {
    if (!name) return 'UR';
    const words = name.trim().split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const initials = isDeliveryRoute ? 'DP' : getInitials(displayName);
  const displayEmail = isDeliveryRoute ? 'nadeem@delivery.com' : (retailerData?.email || 'store.manager@shop.com');
  const displayPhone = isDeliveryRoute ? '+92 300 1234567' : (retailerData?.phone || '+92 300 1234567');
  const displayAddress = isDeliveryRoute ? 'Lahore Main Office, PK' : (retailerData?.deliveryAddress || 'Lahore Main Office, PK');

  const [shareOpen, setShareOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [partners, setPartners] = useState(retailerData?.partners || []);
  const [newPartner, setNewPartner] = useState({ name: '', phone: '', email: '', role: 'Manager' });
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (window.location.hash === '#share') {
      setShareOpen(true);
      setPartnerOpen(false);
    } else if (window.location.hash === '#partners') {
      setPartnerOpen(true);
      setShareOpen(false);
    } else {
      setShareOpen(false);
      setPartnerOpen(false);
    }
  }, [location.hash]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleCopyLink = () => {
    const link = `https://umeed.com/retailer/signup?ref=${displayId}`;
    navigator.clipboard.writeText(link);
    showToast('Referral link copied!');
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setNewPartner({
      name: partners[index].name,
      phone: partners[index].phone,
      email: partners[index].email || '',
      role: partners[index].role
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewPartner({ name: '', phone: '', email: '', role: 'Manager' });
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!newPartner.name.trim() || !newPartner.phone.trim()) {
      showToast('Please fill all fields');
      return;
    }
    const cleanedPhone = newPartner.phone.trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      showToast('Phone number must be exactly 10 digits');
      return;
    }
    setAdding(true);

    let updatedPartners;
    if (editingIndex !== null) {
      updatedPartners = [...partners];
      updatedPartners[editingIndex] = newPartner;
    } else {
      updatedPartners = [...partners, newPartner];
    }

    try {
      const response = await fetch('http://localhost:5200/api/v1/auth/retailer/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: retailerData._id,
          partners: updatedPartners
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save partner');
      setPartners(data.partners || []);
      localStorage.setItem('umeed-retailer', JSON.stringify(data));
      setNewPartner({ name: '', phone: '', email: '', role: 'Manager' });
      setEditingIndex(null);
      showToast(editingIndex !== null ? 'Partner updated successfully!' : 'Partner added successfully!');
    } catch (err) {
      showToast(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeletePartner = async (indexToDelete) => {
    const updatedPartners = partners.filter((_, idx) => idx !== indexToDelete);
    try {
      const response = await fetch('http://localhost:5200/api/v1/auth/retailer/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: retailerData._id,
          partners: updatedPartners
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to remove partner');
      setPartners(data.partners || []);
      localStorage.setItem('umeed-retailer', JSON.stringify(data));
      showToast('Partner removed successfully!');
    } catch (err) {
      showToast(err.message);
    }
  };

  const themeColor = 'bg-black';
  const accentColor = 'text-black';
  const ghostBtn = 'bg-slate-100 text-slate-800';

  return (
    <div className="pb-32 px-4 pt-4 bg-[#F8FAFC] min-h-screen">
      <header className="flex items-center justify-between mb-10 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Profile</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Wholesale identity & settings</p>
        </div>
        {!isDeliveryRoute && !isStaff && (
          <button
            onClick={() => navigate('/retailer/settings')}
            className="h-12 w-12 grid place-items-center bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all"
          >
            <Settings size={20} className="text-slate-600" />
          </button>
        )}
      </header>

      {/* USER CARD */}
      <section className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 relative overflow-hidden mb-8">
        <div className="flex flex-col items-center gap-4 relative z-10 text-center">
          <div className={`h-28 w-28 rounded-[36px] grid place-items-center text-4xl font-black text-white shadow-2xl bg-black shadow-black/20`}>
            {initials}
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-black text-[#0F172A] leading-tight tracking-tight capitalize">
              {displayName}
            </h2>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-2">ID: {displayId}</p>
            <div className={`mt-4 mx-auto flex items-center gap-2 ${isStaff ? 'bg-blue-50 text-blue-700 border-blue-100/50' : 'bg-amber-50 text-amber-700 border-amber-100/50'} px-4 py-2 rounded-2xl w-fit border shadow-sm`}>
              {isStaff ? <Users size={16} strokeWidth={2.5} /> : <Award size={16} strokeWidth={2.5} />}
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                {isStaff ? `${staffRole} (Staff)` : 'Elite Gold Member'}
              </span>
            </div>
          </div>
        </div>
        <ShieldCheck className="absolute -left-6 bottom-0 text-slate-50/50 w-32 h-32 -rotate-12" />
      </section>

      {/* QUICK ACTIONS (RETAILER ONLY) */}
      {!isDeliveryRoute && !isStaff && (
        <section className="mb-10">
          <button
            onClick={() => { window.location.hash = 'share'; }}
            className="w-full bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex flex-col items-center gap-4 active:scale-95 transition-all group"
          >
            <div className="h-14 w-14 bg-slate-100 text-black rounded-[24px] grid place-items-center group-hover:bg-black group-hover:text-white group-hover:shadow-lg group-hover:shadow-black/10 transition-all">
              <UserPlus size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Share Link With Your Retailer Partner</span>
          </button>
        </section>
      )}

      {/* PANEL LIST */}
      <section className="mb-10 px-2 space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Wholesale Panel</h3>
        <div className="bg-white rounded-[32px] border border-slate-50 shadow-sm overflow-hidden">
          <ProfileTab icon={<Phone size={18} />} label="Registered Phone" value={displayPhone} />
          <ProfileTab icon={<MapPin size={18} />} label="Delivery Location" value={displayAddress} />
          {!isDeliveryRoute && (
            <ProfileTab
              icon={<LayoutDashboard size={18} />}
              label="Earning Analytics"
              value="Detailed Dashboard"
              hasArrow
            />
          )}
        </div>
      </section>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="w-full h-16 rounded-[28px] bg-rose-50 text-rose-600 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] active:scale-95 transition-all border border-rose-100/30"
      >
        <LogOut size={20} strokeWidth={2.5} />
        Secure Sign Out
      </button>

      {/* SHARE LINK MODAL */}
      {shareOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full rounded-[32px] max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => { window.location.hash = ''; }}
              className="absolute top-6 right-6 h-10 w-10 grid place-items-center bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="text-center mt-4 mb-6">
              <div className="h-14 w-14 bg-amber-50 text-amber-500 rounded-[20px] grid place-items-center mx-auto mb-4">
                <Share2 size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-[#0F172A]">Share Referral Link</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Invite your retailer partners & unlock premium features together!</p>
            </div>

            {/* SHARE ICONS */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <a
                href={`https://api.whatsapp.com/send?text=Hey!%20Join%20Umeed%20B2B%20Retailer%20network%20and%20order%20wholesale%20goods%20easily%20using%20my%20link:%20https://umeed.com/retailer/signup?ref=${displayId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="h-12 w-12 bg-green-50 text-green-600 rounded-[18px] grid place-items-center group-hover:scale-105 transition-transform">
                  <MessageSquare size={20} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</span>
              </a>
              <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={handleCopyLink}>
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-[18px] grid place-items-center group-hover:scale-105 transition-transform">
                  <Copy size={20} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Copy Link</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
              <span className="text-xs font-bold text-slate-500 truncate max-w-[200px]">https://umeed.com/signup?ref={displayId}</span>
              <button
                onClick={handleCopyLink}
                className="text-xs font-black text-black bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-xl active:scale-95 transition-all"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}



      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-xs font-bold px-6 py-3.5 rounded-2xl shadow-xl z-50 animate-fade-in flex items-center gap-2.5">
          <ShieldCheck size={16} className="text-[#008f67]" />
          {toast}
        </div>
      )}
    </div>
  )
}

function ProfileTab({ icon, label, value, hasArrow }) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-50 last:border-none active:bg-slate-50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-5">
        <div className="text-slate-300 group-hover:text-black transition-colors">{icon}</div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
          <p className="text-sm font-bold text-[#0F172A]">{value}</p>
        </div>
      </div>
      {hasArrow && <ChevronRight size={18} className="text-slate-200" />}
    </div>
  )
}

export default Profile
