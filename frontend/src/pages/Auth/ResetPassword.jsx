import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShieldCheck, KeyRound, ArrowRight } from 'lucide-react'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`https://umeedretailers.com/api/v1/auth/retailer/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password')
      }

      setSubmitting(false)
      setSuccess('Password updated successfully! Redirecting to login...')
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/retailer/auth')
      }, 2000)
    } catch (err) {
      setSubmitting(false)
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#F8FAFC]">
      {/* HEADER HERO */}
      <section className="bg-[#0F172A] rounded-b-[40px] px-6 pb-16 pt-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <div className="h-10 w-10 bg-white/10 rounded-xl grid place-items-center backdrop-blur-md border border-white/10">
               <KeyRound size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Security Center</span>
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tighter">Reset Password</h1>
          <p className="mt-4 max-w-[28ch] text-sm font-medium text-slate-400 leading-relaxed">
            Create a strong and secure new password to access your Umeed Account.
          </p>
        </div>
        <ShieldCheck className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48 -rotate-12" />
      </section>

      {/* FORM SECTION */}
      <section className="flex-1 px-6 pt-8 pb-10">
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 -mt-12 relative z-20">
          
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-500 border border-red-100 flex items-center gap-3 animate-fade-in">
              <ShieldCheck size={18} className="text-red-400" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700 border border-green-100 flex items-center gap-3 animate-fade-in">
              <ShieldCheck size={18} className="text-green-400" />
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
              <input
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                className="w-full h-14 px-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm text-[#0F172A]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Re-type your new password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full h-14 px-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm text-[#0F172A]"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-70"
              disabled={submitting || success}
            >
              {submitting ? 'Updating...' : 'Update Password'}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default ResetPassword
