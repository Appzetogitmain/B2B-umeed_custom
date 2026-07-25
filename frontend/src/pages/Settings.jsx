import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings as SettingsIcon, Save, ShieldCheck } from 'lucide-react'

function Settings() {
  const navigate = useNavigate()
  const [retailer, setRetailer] = useState({ _id: '', name: '', email: '', phone: '', deliveryAddress: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('umeed-retailer') || 'null')
    if (data) {
      setRetailer({
        _id: data._id || '',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        deliveryAddress: data.deliveryAddress || ''
      })
    } else {
      navigate('/retailer/auth', { replace: true })
    }
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setRetailer((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!retailer.name.trim()) {
      setError('Name is required')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/auth/retailer/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(retailer)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      setSubmitting(false)
      setSuccess('Settings updated successfully!')
      localStorage.setItem('umeed-retailer', JSON.stringify(data))
    } catch (err) {
      setSubmitting(false)
      setError(err.message)
    }
  }

  return (
    <div className="pb-32 px-4 pt-4 bg-[#F8FAFC] min-h-screen">
      <header className="flex items-center gap-4 mb-8 px-2">
        <button 
          onClick={() => navigate(-1)}
          className="h-12 w-12 grid place-items-center bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Settings</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage identity & delivery locations</p>
        </div>
      </header>

      {/* FORM SECTION */}
      <section className="bg-white rounded-[40px] p-6 shadow-sm border border-slate-50 relative z-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-slate-100 text-black rounded-[18px] grid place-items-center">
            <SettingsIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Edit Profile</h2>
            <p className="text-xs text-slate-400 font-medium">Update your B2B account information</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-500 border border-red-100 flex items-center gap-2">
            <ShieldCheck size={18} className="text-red-400" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-xs font-semibold text-green-700 border border-green-100 flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-400" />
            {success}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Registered Credentials)</label>
            <input
              name="email"
              type="email"
              value={retailer.email}
              disabled
              className="w-full h-14 px-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-slate-400 font-medium text-sm cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Owner Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Sagar Store"
              value={retailer.name}
              onChange={handleChange}
              className="w-full h-14 px-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm text-[#0F172A]"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registered Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. +92 300 1234567"
              value={retailer.phone}
              onChange={handleChange}
              className="w-full h-14 px-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm text-[#0F172A]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="deliveryAddress" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Location / Address</label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              placeholder="Enter your complete shop delivery address"
              value={retailer.deliveryAddress}
              onChange={handleChange}
              rows="3"
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm text-[#0F172A] resize-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-70 mt-8"
            disabled={submitting}
          >
            {submitting ? 'Saving changes...' : 'Save Settings'}
            {!submitting && <Save size={18} />}
          </button>
        </form>
      </section>
    </div>
  )
}

export default Settings
