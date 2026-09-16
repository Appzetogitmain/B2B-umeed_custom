import { getBackendUrl } from '../../utils/api';
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
        localStorage.setItem('umeed-admin-auth', JSON.stringify(data))
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

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  autoFocus
                  placeholder="admin@umeed.com"
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-lg bg-black px-4 py-3 text-[15px] font-semibold text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
