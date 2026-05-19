import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Auth/Login'
import Signup from '../pages/Auth/Signup'
import Home from '../pages/Home'
import Orders from '../pages/Orders'
import Products from '../pages/Products'
import Wallet from '../pages/Wallet'
import Profile from '../pages/Profile'
import Cart from '../pages/Cart'
import OrderDetail from '../pages/OrderDetail'
import ProductDetail from '../pages/ProductDetail'
import Settings from '../pages/Settings'
import AdminLogin from '../pages/Admin/AdminLogin'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminModulePage from '../pages/Admin/AdminModulePage'
import AdminLayout from '../layouts/AdminLayout'
import RequireAdminAuth from './RequireAdminAuth'
import DeliveryLogin from '../pages/Delivery/DeliveryLogin'
import RequireDeliveryAuth from './RequireDeliveryAuth'
import DeliveryHome from '../pages/Delivery/DeliveryHome'
import DeliveryOrders from '../pages/Delivery/DeliveryOrders'
import DeliveryEarnings from '../pages/Delivery/DeliveryEarnings'
import DeliveryPerformance from '../pages/Delivery/DeliveryPerformance'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/retailer/auth" replace />} />
      <Route path="/admin/auth" element={<AdminLogin />} />

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

      <Route path="/retailer/auth" element={<Login />} />
      <Route path="/retailer/signup" element={<Signup />} />

      {/* Delivery Auth Routes */}
      <Route path="/delivery/auth/*" element={<DeliveryLogin />} />


      <Route path="/retailer" element={<MainLayout />}>
        <Route index element={<Navigate to="/retailer/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order/:id" element={<OrderDetail />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
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
      </Route>

      <Route path="*" element={<Navigate to="/retailer/auth" replace />} />
    </Routes>
  );
}

export default AppRoutes;
