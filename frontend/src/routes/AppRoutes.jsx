import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Auth/Login'
import Signup from '../pages/Auth/Signup'
import ResetPassword from '../pages/Auth/ResetPassword'
import Home from '../pages/Home'
import Orders from '../pages/Orders'
import Products from '../pages/Products'
import Wallet from '../pages/Wallet'
import Profile from '../pages/Profile'
import Cart from '../pages/Cart'
import OrderDetail from '../pages/OrderDetail'
import ProductDetail from '../pages/ProductDetail'
import Settings from '../pages/Settings'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import EarningAnalytics from '../pages/EarningAnalytics'
import AdminLogin from '../pages/Admin/AdminLogin'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminModulePage from '../pages/Admin/AdminModulePage'
import AdminLayout from '../layouts/AdminLayout'
import RequireAdminAuth from './RequireAdminAuth'
import RequireRetailerAuth from './RequireRetailerAuth'
import DeliveryLogin from '../pages/Delivery/DeliveryLogin'
import RequireDeliveryAuth from './RequireDeliveryAuth'
import DeliveryHome from '../pages/Delivery/DeliveryHome'
import DeliveryOrders from '../pages/Delivery/DeliveryOrders'
import DeliveryEarnings from '../pages/Delivery/DeliveryEarnings'
import DeliveryPerformance from '../pages/Delivery/DeliveryPerformance'
import NotificationListener from '../components/NotificationListener'

function AppRoutes() {
  return (
    <>
      <NotificationListener />
      <Routes>
      <Route path="/" element={<SmartRedirect />} />
      <Route path="/admin/auth" element={<AdminAuthRoute />} />

      <Route
        path="/admin"
        element={
          <RequireAdminAuth>
            <AdminLayout />
          </RequireAdminAuth>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path=":module" element={<AdminModulePage />} />
      </Route>

      <Route path="/retailer/auth" element={<RetailerAuthRoute />} />
      <Route path="/retailer/signup" element={<Signup />} />
      <Route path="/retailer/reset-password/:token" element={<ResetPassword />} />

      {/* Delivery Auth Routes */}
      <Route path="/delivery/auth/*" element={<DeliveryAuthRoute />} />


      <Route
        path="/retailer"
        element={
          <RequireRetailerAuth>
            <MainLayout />
          </RequireRetailerAuth>
        }
      >
        <Route index element={<Navigate to="/retailer/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order/:id" element={<OrderDetail />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="earnings" element={<EarningAnalytics />} />
        <Route path="cart" element={<Cart />} />
      </Route>

      {/* Delivery Protected Routes */}
      <Route
        path="/delivery"
        element={
          <RequireDeliveryAuth>
            <MainLayout />
          </RequireDeliveryAuth>
        }
      >
        <Route index element={<Navigate to="/delivery/home" replace />} />
        <Route path="home" element={<DeliveryHome />} />
        <Route path="orders" element={<DeliveryOrders />} />
        <Route path="earnings" element={<DeliveryEarnings />} />
        <Route path="performance" element={<DeliveryPerformance />} />
        <Route path="profile" element={<Profile />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
      </Route>

      <Route path="*" element={<Navigate to="/retailer/auth" replace />} />
      </Routes>
    </>
  );
}

// Helper components to avoid render-time redirect loops
function SmartRedirect() {
  const isRetailerLoggedIn = !!localStorage.getItem('umeed-retailer')
  const isDeliveryLoggedIn = localStorage.getItem('umeed-delivery-auth') === 'true'
  const isAdminLoggedIn = localStorage.getItem('umeed-admin-auth') === 'true'

  if (isRetailerLoggedIn) return <Navigate to="/retailer/home" replace />
  if (isDeliveryLoggedIn) return <Navigate to="/delivery/home" replace />
  if (isAdminLoggedIn) return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/retailer/auth" replace />
}

function AdminAuthRoute() {
  const isAdminLoggedIn = localStorage.getItem('umeed-admin-auth') === 'true'
  if (isAdminLoggedIn) return <Navigate to="/admin/dashboard" replace />
  return <AdminLogin />
}

function RetailerAuthRoute() {
  const isRetailerLoggedIn = !!localStorage.getItem('umeed-retailer')
  if (isRetailerLoggedIn) return <Navigate to="/retailer/home" replace />
  return <Login />
}

function DeliveryAuthRoute() {
  const isDeliveryLoggedIn = localStorage.getItem('umeed-delivery-auth') === 'true'
  if (isDeliveryLoggedIn) return <Navigate to="/delivery/home" replace />
  return <DeliveryLogin />
}

export default AppRoutes;
