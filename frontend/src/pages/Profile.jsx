import { useLocation, useNavigate } from 'react-router-dom'
import { Phone, MapPin, Award, UserPlus, Users, LayoutDashboard, LogOut, ChevronRight, ShieldCheck, Settings } from 'lucide-react'

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
    navigate('/retailer/auth', { replace: true });
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
        <button className="h-12 w-12 grid place-items-center bg-white rounded-2xl shadow-sm border border-slate-100">
          <Settings size={20} className="text-slate-600" />
        </button>
      </header>

      {/* USER CARD */}
      <section className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 relative overflow-hidden mb-8">
        <div className="flex flex-col items-center gap-4 relative z-10 text-center">
          <div className={`h-28 w-28 rounded-[36px] grid place-items-center text-4xl font-black text-white shadow-2xl bg-black shadow-black/20`}>
            {isDeliveryRoute ? 'DP' : 'UR'}
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-black text-[#0F172A] leading-tight tracking-tight">
              {isDeliveryRoute ? 'Nadeem Ahmed' : 'Umeed Retailer'}
            </h2>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-2">ID: {isDeliveryRoute ? 'DP-44712' : 'RT-90817'}</p>
            <div className={`mt-4 mx-auto flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-2xl w-fit border border-amber-100/50 shadow-sm shadow-amber-100`}>
              <Award size={16} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Elite Gold Member</span>
            </div>
          </div>
        </div>
        <ShieldCheck className="absolute -left-6 bottom-0 text-slate-50/50 w-32 h-32 -rotate-12" />
      </section>

      {/* QUICK ACTIONS (RETAILER ONLY) */}
      {!isDeliveryRoute && (
        <section className="grid grid-cols-2 gap-5 mb-10">
          <button className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex flex-col items-center gap-4 active:scale-95 transition-all group">
            <div className="h-14 w-14 bg-slate-100 text-black rounded-[24px] grid place-items-center group-hover:bg-black group-hover:text-white group-hover:shadow-lg group-hover:shadow-black/10 transition-all">
              <UserPlus size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Share Link With Your Retailer Partner</span>
          </button>
          <button className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex flex-col items-center gap-4 active:scale-95 transition-all group">
            <div className="h-14 w-14 bg-slate-50 text-slate-600 rounded-[24px] grid place-items-center group-hover:bg-[#0F172A] group-hover:text-white transition-all">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Retail Partner</span>
          </button>
        </section>
      )}

      {/* PANEL LIST */}
      <section className="mb-10 px-2 space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Wholesale Panel</h3>
        <div className="bg-white rounded-[32px] border border-slate-50 shadow-sm overflow-hidden">
          <ProfileTab icon={<Phone size={18} />} label="Registered Phone" value="+92 300 1234567" />
          <ProfileTab icon={<MapPin size={18} />} label="Delivery Location" value="Lahore Main Office, PK" />
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
