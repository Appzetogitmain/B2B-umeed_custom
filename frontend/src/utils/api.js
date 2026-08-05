const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5200';
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
  return 'https://umeedretailers.com';
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
    url.startsWith('http://localhost:5200') ||
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

const getImageUrl = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return url;
  
  if (url.startsWith('http://localhost:5200')) {
    return url.replace('http://localhost:5200', getBackendUrl());
  }
  if (url.startsWith('/')) {
    return `${getBackendUrl()}${url}`;
  }
  return url;
}

export { getBackendUrl, getToken, getImageUrl }
