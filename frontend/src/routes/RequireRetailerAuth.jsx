import { Navigate } from 'react-router-dom'

function RequireRetailerAuth({ children }) {
  const retailerData = localStorage.getItem('umeed-retailer')
  if (!retailerData) {
    return <Navigate to="/retailer/auth" replace />
  }
  return children
}

export default RequireRetailerAuth
