import { useState, useEffect } from 'react'
import { CreditCard, Wallet as WalletIcon, Gift, ArrowUpRight, ArrowDownLeft, Share2, Users, ShieldCheck, X, Copy, MessageSquare } from 'lucide-react'

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5200';
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
  return 'http://localhost:5200';
}

function Wallet() {
  const [walletData, setWalletData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [retailerData, setRetailerData] = useState(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('umeed-retailer') || 'null')
    setRetailerData(data)
  }, [])

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const retailerStorage = JSON.parse(localStorage.getItem('umeed-retailer') || '{}')
        const retailerId = retailerStorage.id || retailerStorage._id
        if (retailerId) {
          const response = await fetch(`${getBackendUrl()}/api/v1/wallets/retailer/${retailerId}`)
          if (response.ok) {
            const data = await response.json()
            setWalletData(data)
          }
        }
      } catch (err) {
        console.error('Error fetching wallet:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchWallet()
  }, [])

  const displayId = retailerData?._id ? `RT-${retailerData._id.substring(retailerData._id.length - 6).toUpperCase()}` : 'RT-00000'

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const handleCopyLink = () => {
    const link = `https://umeed.com/retailer/signup?ref=${displayId}`
    navigator.clipboard.writeText(link)
    showToast('Referral link copied!')
  }

  const handleShareClick = () => {
    const shareText = `Hey! Join Umeed B2B Retailer network and order wholesale goods easily using my link: https://umeed.com/retailer/signup?ref=${displayId}`
    if (navigator.share) {
      navigator.share({
        title: 'Umeed B2B Retailer Network',
        text: shareText,
        url: `https://umeed.com/retailer/signup?ref=${displayId}`
      }).catch(() => {
        setShareOpen(true)
      })
    } else {
      setShareOpen(true)
    }
  }

  const formatCurrency = (num) => {
    return '₹' + Math.round(num || 0).toLocaleString('en-IN')
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

    if (diffDays === 0) return `Today, ${timeStr}`
    if (diffDays === 1) return `Yesterday, ${timeStr}`
    return `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }

  // Values from API (all from DB)
  const balance = walletData?.balance || 0
  const cashback = walletData?.cashback || 0
  const vouchers = walletData?.vouchers || 0
  const giftPoints = walletData?.giftPoints || 0
  const profitSharing = walletData?.profitSharing || { tier1: 0, tier2: 0, tier3: 0, total: 0 }
  const activeCards = walletData?.activeCards || 0
  const transactions = walletData?.transactions || []

  if (loading) {
    return (
      <div className="pb-4 px-4 pt-4 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Loading wallet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-4 px-4 pt-4 bg-[#F8FAFC]">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Wallet</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage wholesale credits</p>
        </div>
        <button
          onClick={handleShareClick}
          className="h-12 w-12 grid place-items-center bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all"
        >
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
          <h2 className="text-5xl font-black mb-10 tracking-tighter">{formatCurrency(balance)}</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1.5 opacity-80">
                <ArrowDownLeft size={12} />
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Cashback</p>
              </div>
              <p className="text-lg font-black tracking-tight">{formatCurrency(cashback)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1.5 opacity-80">
                <Gift size={12} />
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Vouchers</p>
              </div>
              <p className="text-lg font-black tracking-tight">{formatCurrency(vouchers)}</p>
            </div>
          </div>
        </div>
        <WalletIcon className="absolute -right-12 -top-12 text-white/5 w-64 h-64 -rotate-12" />
      </section>

      {/* REFERRAL INCOME / PROFIT SHARING */}
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
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Tier 1</p>
            <p className="text-sm font-black text-[#0F172A]">{formatCurrency(profitSharing.tier1)}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Tier 2</p>
            <p className="text-sm font-black text-[#0F172A]">{formatCurrency(profitSharing.tier2)}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Tier 3</p>
            <p className="text-sm font-black text-[#0F172A]">{formatCurrency(profitSharing.tier3)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500">Total Profit Sharing Earnings</span>
          <span className="text-xl font-black text-black tracking-tight">{formatCurrency(profitSharing.total)}</span>
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
            <p className="text-base font-black text-[#0F172A]">{giftPoints.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-100 rounded-2xl grid place-items-center text-black">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Cards</p>
            <p className="text-base font-black text-[#0F172A]">{activeCards}</p>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <section>
        <div className="flex items-center justify-between mb-5 px-2">
          <h3 className="font-bold text-xl text-[#0F172A]">Recent Activity</h3>
          <button className="text-black text-xs font-black uppercase tracking-widest">See History</button>
        </div>
        {transactions.length === 0 ? (
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 text-center">
            <p className="text-sm text-slate-400 font-medium">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((t) => (
              <div key={t._id} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 flex items-center justify-between group active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl grid place-items-center ${t.transactionType === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                    {t.transactionType === 'Credit' ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A] mb-1 line-clamp-1">{t.reason}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{formatDate(t.createdAt)}</p>
                  </div>
                </div>
                <p className={`text-base font-black ${t.transactionType === 'Credit' ? 'text-emerald-600' : 'text-[#000]'}`}>
                  {t.transactionType === 'Credit' ? '+' : '-'} {formatCurrency(t.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SHARE LINK MODAL */}
      {shareOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full rounded-[32px] max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShareOpen(false)}
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

            {/* SHARE VIA NATIVE SHARE (ALL APPS) */}
            <button
              onClick={() => {
                const shareText = `Hey! Join Umeed B2B Retailer network and order wholesale goods easily using my link: https://umeed.com/retailer/signup?ref=${displayId}`
                if (navigator.share) {
                  navigator.share({
                    title: 'Umeed B2B Retailer Network',
                    text: shareText,
                    url: `https://umeed.com/retailer/signup?ref=${displayId}`
                  }).catch(() => {})
                }
              }}
              className="w-full mb-5 h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-lg shadow-black/10"
            >
              <Share2 size={18} />
              Share via Apps
            </button>

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
              <a
                href={`https://t.me/share/url?url=https://umeed.com/retailer/signup?ref=${displayId}&text=Hey!%20Join%20Umeed%20B2B%20Retailer%20network`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="h-12 w-12 bg-sky-50 text-sky-600 rounded-[18px] grid place-items-center group-hover:scale-105 transition-transform">
                  <MessageSquare size={20} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Telegram</span>
              </a>
              <a
                href={`sms:?body=Hey! Join Umeed B2B Retailer network: https://umeed.com/retailer/signup?ref=${displayId}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-[18px] grid place-items-center group-hover:scale-105 transition-transform">
                  <MessageSquare size={20} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SMS</span>
              </a>
              <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={handleCopyLink}>
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-[18px] grid place-items-center group-hover:scale-105 transition-transform">
                  <Copy size={20} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Copy</span>
              </div>
            </div>

            {/* REFERRAL LINK DISPLAY */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Referral Link</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-600 truncate">https://umeed.com/retailer/signup?ref={displayId}</span>
                <button
                  onClick={handleCopyLink}
                  className="text-xs font-black text-black bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-xl active:scale-95 transition-all shrink-0"
                >
                  Copy
                </button>
              </div>
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

export default Wallet
