import { CreditCard, Wallet as WalletIcon, Gift, ArrowUpRight, ArrowDownLeft, Share2, Users, ShieldCheck } from 'lucide-react'

const walletBalances = {
  total: '₹18,760',
  cashback: '₹2,140',
  vouchers: '₹980',
  giftPoints: '1,250'
}

const referralIncome = {
  level1: '₹1,200',
  level2: '₹450',
  level3: '₹180',
  total: '₹1,830'
}

const transactions = [
  { title: 'Order Payment - ORD-3012', date: 'Today, 10:42 AM', amount: '₹12,450', type: 'debit' },
  { title: 'Cashback Earned', date: 'Yesterday, 07:12 PM', amount: '₹320', type: 'credit' },
  { title: 'Referral Credit - Tier 1', date: '14 Apr 2026', amount: '₹150', type: 'credit' },
]

function Wallet() {
  return (
    <div className="pb-4 px-4 pt-4 bg-[#F8FAFC]">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Wallet</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage wholesale credits</p>
        </div>
        <button className="h-12 w-12 grid place-items-center bg-white rounded-2xl shadow-sm border border-slate-100">
          <Share2 size={20} className="text-slate-600" />
        </button>
      </header>

      {/* MAIN BALANCE CARD */}
      <section className="relative overflow-hidden bg-black text-white p-8 rounded-[40px] mb-8 shadow-2xl shadow-black/10">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <ShieldCheck size={14} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Balance</p>
          </div>
          <h2 className="text-5xl font-black mb-10 tracking-tighter">{walletBalances.total}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1.5 opacity-80">
                <ArrowDownLeft size={12} />
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Cashback</p>
              </div>
              <p className="text-lg font-black tracking-tight">{walletBalances.cashback}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1.5 opacity-80">
                <Gift size={12} />
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Vouchers</p>
              </div>
              <p className="text-lg font-black tracking-tight">{walletBalances.vouchers}</p>
            </div>
          </div>
        </div>
        <WalletIcon className="absolute -right-12 -top-12 text-white/5 w-64 h-64 -rotate-12" />
      </section>

      {/* REFERRAL INCOME */}
      <section className="bg-white rounded-[32px] p-6 mb-8 shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 text-black rounded-xl grid place-items-center">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg">Profit Sharing Income</h3>
          </div>
          <span className="text-[9px] font-black text-black bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest leading-none">3-Tier Rewards</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 tracking-wider tracking-tighter">Tier 1</p>
            <p className="text-sm font-black text-[#0F172A]">{referralIncome.level1}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 tracking-wider tracking-tighter">Tier 2</p>
            <p className="text-sm font-black text-[#0F172A]">{referralIncome.level2}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 tracking-wider tracking-tighter">Tier 3</p>
            <p className="text-sm font-black text-[#0F172A]">{referralIncome.level3}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500">Total Profit Sharing Earnings</span>
          <span className="text-xl font-black text-black tracking-tight">{referralIncome.total}</span>
        </div>
      </section>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-4">
          <div className="h-12 w-12 bg-amber-50 rounded-2xl grid place-items-center text-amber-600">
            <Gift size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gift Pts</p>
            <p className="text-base font-black text-[#0F172A]">{walletBalances.giftPoints}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-100 rounded-2xl grid place-items-center text-black">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Cards</p>
            <p className="text-base font-black text-[#0F172A]">2</p>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <section>
        <div className="flex items-center justify-between mb-5 px-2">
          <h3 className="font-bold text-xl text-[#0F172A]">Recent Activity</h3>
          <button className="text-black text-xs font-black uppercase tracking-widest">See History</button>
        </div>
        <div className="space-y-4">
          {transactions.map((t, i) => (
            <div key={i} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 flex items-center justify-between group active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl grid place-items-center ${
                  t.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                }`}>
                  {t.type === 'credit' ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1 line-clamp-1">{t.title}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t.date}</p>
                </div>
              </div>
              <p className={`text-base font-black ${t.type === 'credit' ? 'text-emerald-600' : 'text-[#000]'}`}>
                {t.type === 'credit' ? '+' : '-'} {t.amount}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Wallet
