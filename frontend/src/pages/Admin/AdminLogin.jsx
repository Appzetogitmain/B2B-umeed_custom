import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import urLogo from '../../assets/ur.png'

function AdminLogin() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`${getBackendUrl()}/api/v1/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('umeed-admin-auth', 'true')
        localStorage.setItem('umeed-admin-email', data.email)
        localStorage.setItem('umeed-admin-token', data.token)
        navigate('/admin/dashboard', { replace: true })
      } else {
        setError(data.message || 'Invalid email or password')
      }
    } catch (err) {
      setError('Server error, please try again later')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f5f5f5] p-4">
      <div className="w-full max-w-[380px] rounded-[14px] border border-[#e5e5e5] bg-white p-7 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
        <div className="text-center">
          <div className="mx-auto flex justify-center mt-0 -mb-8">
            <img src={urLogo} alt="Umeed Logo" className="h-28 w-auto object-contain mix-blend-multiply" />
          </div>
          <h2 className="mt-1 text-xl font-semibold text-black hidden">Umeed</h2>
          <p className="mt-1 text-sm text-gray-500">Admin Panel Access</p>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">ADMIN ACCESS</p>
          <h1 className="mt-2 text-2xl font-semibold text-black">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-500">Login to access your dashboard</p>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">
              {error}
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-medium text-gray-600">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="admin@umeed.com"
                className="h-[44px] w-full rounded-[8px] border border-[#d1d5db] bg-white px-3 text-[14px] text-gray-700 outline-none transition-colors duration-200 placeholder-[#9ca3af] focus:border-black"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-medium text-gray-600">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="h-[44px] w-full rounded-[8px] border border-[#d1d5db] bg-white px-3 text-[14px] text-gray-700 outline-none transition-colors duration-200 placeholder-[#9ca3af] focus:border-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-[44px] w-full rounded-[8px] bg-black px-4 text-[14px] font-medium text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
