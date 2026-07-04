import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

function DeliveryLogin() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isDeliveryAuthenticated = localStorage.getItem('umeed-delivery-auth') === 'true'

  const getBackendUrl = () => {
    const hostname = window.location.hostname;
    if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5200';
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
    return 'http://localhost:5200';
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError('Please provide email and password')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/partners/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      localStorage.setItem('umeed-delivery-auth', 'true')
      localStorage.setItem('umeed-delivery-partner', JSON.stringify(data))
      navigate('/delivery/home', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (isDeliveryAuthenticated) {
    return <Navigate to="/delivery/home" replace />
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F8FAFC] px-4 py-8">
      <div className="w-full max-w-md">
        <section className="bg-black rounded-[28px] px-6 pb-12 pt-10 text-white shadow-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-gray-400 font-semibold">Delivery Portal</p>
          <h1 className="mt-2 text-[30px] font-bold leading-tight tracking-[-0.01em]">Umeed Delivery</h1>
          <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-gray-400">
            Login to manage assigned orders, delivery status, and your daily earnings.
          </p>
        </section>

        <section className="bg-white rounded-[28px] -mt-8 mx-3 p-6 shadow-sm border border-slate-100 relative z-10">
          <h2 className="text-lg font-semibold text-slate-900">Delivery Login</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-500 border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-medium text-slate-600">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="partner@umeed.com"
                value={credentials.email}
                onChange={handleChange}
                className="w-full h-12 px-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-black focus:ring-2 focus:ring-slate-100 transition-all text-sm text-slate-700"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-medium text-slate-600">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-12 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-black focus:ring-2 focus:ring-slate-100 transition-all text-sm text-slate-700"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full h-14 bg-black py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg active:scale-[0.98] transition-all mt-2 disabled:opacity-70">
              {submitting ? 'Logging in...' : 'Login to Delivery Partner App'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default DeliveryLogin
