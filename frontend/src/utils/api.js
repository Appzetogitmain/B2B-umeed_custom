const getBackendUrl = () => {
  // Use Vite env variable if available, stripping the /api/v1 part to get base URL
  if (import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  }
  return `${getBackendUrl()}`;
}

// Get the auth token from localStorage based on which app is active
const getToken = () => {
  // Check retailer
  const retailer = JSON.parse(localStorage.getItem('umeed-retailer') || 'null')
  if (retailer?.token) return retailer.token

  // Check delivery partner
  const delivery = JSON.parse(localStorage.getItem('umeed-delivery-partner') || 'null')
  if (delivery?.token) return delivery.token

  // Check admin
  const adminToken = localStorage.getItem('umeed-admin-token')
  if (adminToken) return adminToken

  return null
}

// Authenticated fetch wrapper
export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken()
  const url = `${getBackendUrl()}${endpoint}`

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  return response
}

// Override global fetch to auto-inject token for backend requests
const originalFetch = window.fetch
window.fetch = function(url, options = {}) {
  const backendUrl = getBackendUrl()
  
  // Only inject token for our backend API calls (match both dynamic URL and hardcoded localhost)
  const isBackendCall = typeof url === 'string' && (
    url.startsWith(backendUrl) ||
    url.startsWith(`${getBackendUrl()}`) ||
    url.includes(':5200/api/')
  )

  if (isBackendCall) {
    const token = getToken()
    if (token) {
      const headers = options.headers || {}
      // Don't override if Authorization already set
      if (!headers['Authorization'] && !headers['authorization']) {
        options = {
          ...options,
          headers: {
            ...headers,
            'Authorization': `Bearer ${token}`
          }
        }
      }
    }
  }
  
  return originalFetch.call(this, url, options)
}

export { getBackendUrl, getToken }
