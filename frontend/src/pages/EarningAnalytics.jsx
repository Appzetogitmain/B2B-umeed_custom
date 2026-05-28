import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Gift, CreditCard, Users, ArrowDownLeft, ArrowUpRight, BarChart3, PieChart } from 'lucide-react'

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5200';
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
  return 'http://localhost:5200';
}

function EarningAnalytics() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const retailerStorage = JSON.parse(localStorage.getItem('umeed-retailer') || '{}')
        const retailerId = retailerStorage.id || retailerStorage._id
        if (retailerId) {
          const response = await fetch(`${getBackendUrl()}/api/v1/dashboard/earnings/${retailerId}`)
          if (response.ok) {
            const result = await response.json()
            setData(result)
          }
        }
      } catch (err) {
        console.error('Error fetching earning analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const formatCurrency = (num) => '₹' + Math.round(num || 0).toLocaleString('en-IN')

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    if (diffDays === 0) return `Today, ${timeStr}`
    if (diffDays === 1) return `Yesterday, ${timeStr}`
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="pb-4 px-4 pt-4 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const overview = data?.overview || {}
  const orderStats = data?.orderStats || {}
  const profitSharing = data?.profitSharing || {}
  const txSummary = data?.transactionSummary || {}
  const earningTrend = data?.earningTrend || []
  const transactions = data?.recentTransactions || []

  // Find max earning for bar chart scaling
  const maxEarning = Math.max(...earningTrend.map(e => e.earned), 1)

  return (
    <div className="pb-32 px-4 pt-4 bg-[#F8FAFC] min-h-screen">
      {/* HEADER */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="h-12 w-12 grid place-items-center bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Earning Analytics</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Detailed financial dashboard</p>
        </div>
      </header>

      {/* BALANCE OVERVIEW */}
      <section className="relative overflow-hidden bg-black text-white p-7 rounded-[36px] mb-8 shadow-2xl shadow-black/10">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total Balance</p>
          <h2 className="text-4xl font-black tracking-tighter mb-6">{formatCurrency(overview.totalBalance)}</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Cashback</p>
              <p className="text-sm font-black">{formatCurrency(overview.cashback)}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Vouchers</p>
              <p className="text-sm font-black">{formatCurrency(overview.vouchers)}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Gift Pts</p>
              <p className="text-sm font-black">{(overview.giftPoints || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <Wallet className="absolute -right-8 -top-8 text-white/5 w-48 h-48 -rotate-12" />
      </section>

      {/* ORDER STATS */}
      <section className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50 text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Orders</p>
          <p className="text-xl font-black text-[#0F172A]">{orderStats.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50 text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Spent</p>
          <p className="text-xl font-black text-[#0F172A]">{formatCurrency(orderStats.totalSpent)}</p>
        </div>
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50 text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Avg Order</p>
          <p className="text-xl font-black text-[#0F172A]">{formatCurrency(orderStats.avgOrderValue)}</p>
        </div>
      </section>

      {/* EARNING TREND (BAR CHART) */}
      <section className="bg-white rounded-[32px] p-6 mb-8 shadow-sm border border-slate-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-slate-100 text-black rounded-xl grid place-items-center">
            <BarChart3 size={20} />
          </div>
          <h3 className="font-bold text-[#0F172A] text-base">Monthly Earnings</h3>
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {earningTrend.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex justify-center">
                <div
                  className="w-8 bg-black rounded-lg transition-all"
                  style={{ height: `${Math.max((item.earned / maxEarning) * 100, 4)}%`, minHeight: '4px' }}
                ></div>
              </div>
              <p className="text-[8px] font-black text-slate-400 uppercase">{item.month}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROFIT SHARING */}
      <section className="bg-white rounded-[32px] p-6 mb-8 shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 text-black rounded-xl grid place-items-center">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-base">Profit Sharing</h3>
          </div>
          <span className="text-[9px] font-black text-black bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest">3-Tier</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100/50">
            <p className="text-[9px] font-black text-emerald-600 uppercase mb-1 tracking-wider">Tier 1</p>
            <p className="text-sm font-black text-emerald-700">{formatCurrency(profitSharing.tier1)}</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100/50">
            <p className="text-[9px] font-black text-blue-600 uppercase mb-1 tracking-wider">Tier 2</p>
            <p className="text-sm font-black text-blue-700">{formatCurrency(profitSharing.tier2)}</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100/50">
            <p className="text-[9px] font-black text-purple-600 uppercase mb-1 tracking-wider">Tier 3</p>
            <p className="text-sm font-black text-purple-700">{formatCurrency(profitSharing.tier3)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500">Total Profit Sharing</span>
          <span className="text-lg font-black text-black">{formatCurrency(profitSharing.total)}</span>
        </div>
      </section>

      {/* CREDIT / DEBIT SUMMARY */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-50 p-5 rounded-[28px] border border-emerald-100/50">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-emerald-600" />
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Total Credits</p>
          </div>
          <p className="text-xl font-black text-emerald-700">{formatCurrency(txSummary.totalCredits)}</p>
          <p className="text-[10px] text-emerald-500 font-bold mt-1">{txSummary.creditCount || 0} transactions</p>
        </div>
        <div className="bg-rose-50 p-5 rounded-[28px] border border-rose-100/50">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-rose-600" />
            <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Total Debits</p>
          </div>
          <p className="text-xl font-black text-rose-700">{formatCurrency(txSummary.totalDebits)}</p>
          <p className="text-[10px] text-rose-500 font-bold mt-1">{txSummary.debitCount || 0} transactions</p>
        </div>
      </section>

      {/* NET EARNINGS */}
      <section className="bg-white rounded-[32px] p-6 mb-8 shadow-sm border border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl grid place-items-center">
            <PieChart size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Net Earnings</p>
            <p className="text-xs text-slate-500 font-medium">Credits - Debits</p>
          </div>
        </div>
        <p className={`text-2xl font-black ${(txSummary.netEarnings || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {formatCurrency(txSummary.netEarnings)}
        </p>
      </section>

      {/* RECENT TRANSACTIONS */}
      <section>
        <div className="flex items-center justify-between mb-5 px-2">
          <h3 className="font-bold text-lg text-[#0F172A]">Recent Transactions</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 text-center">
            <p className="text-sm text-slate-400 font-medium">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t._id} className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-11 w-11 rounded-2xl grid place-items-center ${t.transactionType === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                    {t.transactionType === 'Credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A] mb-0.5 line-clamp-1">{t.reason}</h4>
                    <p className="text-[10px] font-bold text-slate-400">{formatDate(t.createdAt)}</p>
                  </div>
                </div>
                <p className={`text-sm font-black ${t.transactionType === 'Credit' ? 'text-emerald-600' : 'text-[#0F172A]'}`}>
                  {t.transactionType === 'Credit' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default EarningAnalytics
