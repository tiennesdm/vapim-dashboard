import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import APICreate from './pages/publisher/APICreate'
import APIDetail from './pages/publisher/APIDetail'
import APIDesigner from './pages/publisher/APIDesigner'
import Lifecycle from './pages/publisher/Lifecycle'
import Catalog from './pages/devportal/Catalog'
import DevPortalAPIDetail from './pages/devportal/APIDetail'
import TryIt from './pages/devportal/TryIt'
import Applications from './pages/devportal/Applications'
import DevPortalSubscriptions from './pages/devportal/Subscriptions'
import SDK from './pages/devportal/SDK'
import AdminDashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import Tenants from './pages/admin/Tenants'
import Throttling from './pages/admin/Throttling'
import GatewayConfig from './pages/admin/Gateway'
import Audit from './pages/admin/Audit'
import Webhooks from './pages/admin/Webhooks'
import Settings from './pages/admin/Settings'
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard'

export default function App() {
  return (
    <Routes>
      {/* Home / Publisher APIs */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Publisher routes */}
      <Route path="/publisher/apis" element={<Home />} />
      <Route path="/publisher/apis/create" element={<APICreate />} />
      <Route path="/publisher/apis/:id" element={<APIDetail />} />
      <Route path="/publisher/apis/:id/design" element={<APIDesigner />} />
      <Route path="/publisher/apis/:id/lifecycle" element={<Lifecycle />} />

      {/* Developer Portal routes */}
      <Route path="/devportal/catalog" element={<Catalog />} />
      <Route path="/devportal/apis/:id" element={<DevPortalAPIDetail />} />
      <Route path="/devportal/apis/:id/tryit" element={<TryIt />} />
      <Route path="/devportal/applications" element={<Applications />} />
      <Route path="/devportal/subscriptions" element={<DevPortalSubscriptions />} />
      <Route path="/devportal/apis/:id/sdk" element={<SDK />} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/tenants" element={<Tenants />} />
      <Route path="/admin/throttling" element={<Throttling />} />
      <Route path="/admin/gateway" element={<GatewayConfig />} />
      <Route path="/admin/audit" element={<Audit />} />
      <Route path="/admin/webhooks" element={<Webhooks />} />
      <Route path="/admin/settings" element={<Settings />} />

      {/* Analytics */}
      <Route path="/analytics" element={<AnalyticsDashboard />} />
    </Routes>
  )
}
