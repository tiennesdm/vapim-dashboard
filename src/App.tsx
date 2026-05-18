import { Routes, Route, Navigate } from 'react-router'
import { AuthProvider, useAuth } from './hooks/useAuth'
import PrivateRoute from './components/PrivateRoute'
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
import AIGateway from './pages/admin/AIGateway'
import MCPHub from './pages/admin/MCPHub'
import Governance from './pages/admin/Governance'
import Monetization from './pages/admin/Monetization'
import APIChat from './pages/admin/APIChat'
import Certificates from './pages/admin/Certificates'
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard'

function LoginRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Login />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public route - Login (redirects to home if already logged in) */}
      <Route path="/login" element={<LoginRoute />} />

      {/* Protected routes - require authentication */}
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />

      {/* Publisher routes */}
      <Route path="/publisher/apis" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/publisher/apis/create" element={<PrivateRoute><APICreate /></PrivateRoute>} />
      <Route path="/publisher/apis/:id" element={<PrivateRoute><APIDetail /></PrivateRoute>} />
      <Route path="/publisher/apis/:id/design" element={<PrivateRoute><APIDesigner /></PrivateRoute>} />
      <Route path="/publisher/apis/:id/lifecycle" element={<PrivateRoute><Lifecycle /></PrivateRoute>} />

      {/* Developer Portal routes */}
      <Route path="/devportal/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
      <Route path="/devportal/apis/:id" element={<PrivateRoute><DevPortalAPIDetail /></PrivateRoute>} />
      <Route path="/devportal/apis/:id/tryit" element={<PrivateRoute><TryIt /></PrivateRoute>} />
      <Route path="/devportal/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
      <Route path="/devportal/subscriptions" element={<PrivateRoute><DevPortalSubscriptions /></PrivateRoute>} />
      <Route path="/devportal/apis/:id/sdk" element={<PrivateRoute><SDK /></PrivateRoute>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute><Users /></PrivateRoute>} />
      <Route path="/admin/tenants" element={<PrivateRoute><Tenants /></PrivateRoute>} />
      <Route path="/admin/throttling" element={<PrivateRoute><Throttling /></PrivateRoute>} />
      <Route path="/admin/gateway" element={<PrivateRoute><GatewayConfig /></PrivateRoute>} />
      <Route path="/admin/audit" element={<PrivateRoute><Audit /></PrivateRoute>} />
      <Route path="/admin/webhooks" element={<PrivateRoute><Webhooks /></PrivateRoute>} />
      <Route path="/admin/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/admin/ai-gateway" element={<PrivateRoute><AIGateway /></PrivateRoute>} />
      <Route path="/admin/mcp-hub" element={<PrivateRoute><MCPHub /></PrivateRoute>} />
      <Route path="/admin/governance" element={<PrivateRoute><Governance /></PrivateRoute>} />
      <Route path="/admin/monetization" element={<PrivateRoute><Monetization /></PrivateRoute>} />
      <Route path="/admin/api-chat" element={<PrivateRoute><APIChat /></PrivateRoute>} />
      <Route path="/admin/certificates" element={<PrivateRoute><Certificates /></PrivateRoute>} />

      {/* Analytics */}
      <Route path="/analytics" element={<PrivateRoute><AnalyticsDashboard /></PrivateRoute>} />

      {/* Catch-all: redirect unknown routes to login or home */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
