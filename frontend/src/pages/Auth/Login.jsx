import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, ArrowRight, ShieldCheck, ArrowLeft, Mail, Eye, EyeOff } from 'lucide-react'
import urLogo from '../../assets/ur.png'
import { requestNotificationPermission } from '../../utils/firebase'

function Login() {
  const [loginType, setLoginType] = useState('owner') // 'owner' or 'partner'
  const [form, setForm] = useState({ email: '', password: '' })
  const [partnerForm, setPartnerForm] = useState({ ownerEmail: '', partnerPhone: '' })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [view, setView] = useState('login') // 'login' or 'forgot'
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotSubmitting, setForgotSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleForgotSubmit = async (event) => {
    event.preventDefault()
    setForgotError('')
    setForgotSuccess('')

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address')
      return
    }

    setForgotSubmitting(true)

    try {
      const response = await fetch('https://umeedretailers.com/api/v1/auth/retailer/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setForgotSubmitting(false)
      setForgotSuccess(data.message)
      setForgotEmail('')
    } catch (err) {
      setForgotSubmitting(false)
      setForgotError(err.message)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handlePartnerChange = (event) => {
    const { name, value } = event.target
    if (name === 'partnerPhone') {
      setPartnerForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }))
    } else {
      setPartnerForm((prev) => ({ ...prev, [name]: value }))
    }
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (loginType === 'owner') {
      const payload = {
        email: form.email.trim(),
        password: form.password,
      }

      if (!payload.email || !payload.password) {
        setError('Please provide email and password')
        return
      }

      setSubmitting(true)

      try {
        const response = await fetch(`${getBackendUrl()}/api/v1/auth/retailer/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Invalid email or password')
        }

        setSubmitting(false)
        localStorage.setItem('umeed-retailer', JSON.stringify(data))
        requestNotificationPermission('retailer', data.token)
        navigate('/retailer/home')
      } catch (err) {
        setSubmitting(false)
        setError(err.message)
      }
    } else {
      const payload = {
        ownerEmail: partnerForm.ownerEmail.trim(),
        partnerPhone: partnerForm.partnerPhone.trim(),
      }

      if (!payload.ownerEmail || !payload.partnerPhone) {
        setError('Please provide owner email and partner phone')
        return
      }

      if (!/^\d{10}$/.test(payload.partnerPhone)) {
        setError('Phone number must be exactly 10 digits')
        return
      }

      setSubmitting(true)

      try {
        const response = await fetch(`${getBackendUrl()}/api/v1/auth/retailer/partner-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Invalid partner credentials')
        }

        setSubmitting(false)
        localStorage.setItem('umeed-retailer', JSON.stringify(data))
        requestNotificationPermission('retailer', data.token)
        navigate('/retailer/home')
      } catch (err) {
        setSubmitting(false)
        setError(err.message)
      }
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#F8FAFC]">
      {/* HEADER HERO */}
      <section className="bg-[#0F172A] rounded-b-[40px] px-6 pb-16 pt-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="mb-6 inline-flex bg-white rounded-full h-24 w-24 items-center justify-center overflow-hidden shadow-md">
            <img src={urLogo} alt="Umeed Logo" className="h-full w-full object-contain mix-blend-multiply scale-110" />
          </div>
          <div className="flex items-center gap-2 mb-2">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Retailer Portal</span>
          </div>
          <p className="mt-2 max-w-[28ch] text-sm font-medium text-slate-400 leading-relaxed">
            Wholesale ordering platform for local stores and supermarkets.
          </p>
        </div>
        <ShieldCheck className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48 -rotate-12" />
      </section>

      {/* FORM SECTION */}
      <section className="flex-1 px-6 pt-8 pb-10">
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 -mt-12 relative z-20">

          {view === 'forgot' ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setView('login')
                    setForgotError('')
                    setForgotSuccess('')
                  }}
                  className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 grid place-items-center active:scale-95 transition-all text-slate-600"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">Forgot Password</h2>
                  <p className="text-xs text-slate-400 font-medium">Reset your retailer account credentials</p>
                </div>
              </div>

              {forgotError && (
                <div className="mb-6 rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-500 border border-red-100 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-red-400" />
                  {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div className="mb-6 rounded-2xl bg-green-50 p-4 text-xs font-semibold text-green-700 border border-green-100 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-400" />
                  {forgotSuccess}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleForgotSubmit}>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Registered Email</label>
                  <input
                    type="email"
                    placeholder="store.manager@shop.com"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value)
                      if (forgotError) setForgotError('')
                    }}
                    className="w-full h-14 px-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm text-[#0F172A]"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-70"
                  disabled={forgotSubmitting}
                >
                  {forgotSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                  {!forgotSubmitting && <Mail size={18} />}
                </button>
              </form>
            </>
          ) : (
            <>
              {error && (
                <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-500 border border-red-100 flex items-center gap-3 animate-fade-in">
                  <ShieldCheck size={18} className="text-red-400" />
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {loginType === 'owner' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Account</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="store.manager@shop.com"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full h-14 px-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm text-[#0F172A]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Password</label>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={form.password}
                          onChange={handleChange}
                          className="w-full h-14 pl-4 pr-12 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm text-[#0F172A]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button 
                        type="button" 
                        onClick={() => {
                          setView('forgot')
                          setError('')
                        }}
                        className="text-xs font-bold text-black border-b border-black/10 focus:outline-none"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Owner Email Account</label>
                      <input
                        name="ownerEmail"
                        type="email"
                        placeholder="owner@store.com"
                        value={partnerForm.ownerEmail}
                        onChange={handlePartnerChange}
                        className="w-full h-14 px-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm text-[#0F172A]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Partner Phone Number</label>
                      <input
                        name="partnerPhone"
                        type="tel"
                        placeholder="e.g. 9875774774"
                        value={partnerForm.partnerPhone}
                        onChange={handlePartnerChange}
                        maxLength={10}
                        className="w-full h-14 px-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm text-[#0F172A]"
                        required
                      />
                    </div>
                  </>
                )}

                <button 
                  type="submit" 
                  className="w-full h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-70"
                  disabled={submitting}
                >
                  {submitting ? 'Verifying...' : 'Login Securely'}
                  {!submitting && <ArrowRight size={18} />}
                </button>
              </form>
            </>
          )}

          <div className="mt-3 text-center pt-4 border-t border-slate-50">
            <p className="text-sm font-medium text-slate-500">
              New retailer?{' '}
              <Link to="/retailer/signup" className="font-extrabold text-black hover:underline underline-offset-4">
                Join Network
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
