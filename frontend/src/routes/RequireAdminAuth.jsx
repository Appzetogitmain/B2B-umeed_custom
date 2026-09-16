import { Navigate } from 'react-router-dom'

function RequireAdminAuth({ children }) {
  const auth = localStorage.getItem('umeed-admin-auth');
  const isAdminAuthenticated = auth === 'true' || (auth && auth.includes('{'));

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/auth" replace />
  }

  return children
}

export default RequireAdminAuth
