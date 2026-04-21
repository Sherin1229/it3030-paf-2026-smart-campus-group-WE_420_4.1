import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UserDashboardPage from './pages/dashboard/UserDashboardPage'
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage'
import UserProfilePage from './pages/profile/UserProfilePage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import UserDashboardLayout from './layouts/UserDashboardLayout'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import { Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'
import PublicOnlyRoute from './routes/PublicOnlyRoute'

// ✅ Your imports - Module A
import ResourceListPage from './pages/resources/ResourceListPage'
import ResourceDetailPage from './pages/resources/ResourceDetailPage'
import AdminResourcePanel from './pages/resources/AdminResourcePanel'

function App() {
  const location = useLocation()
  const currentPath = location.pathname.toLowerCase()
  const isWorkspaceRoute =
    currentPath.startsWith('/dashboard/user') ||
    currentPath.startsWith('/dashboard/admin') ||
    currentPath.startsWith('/profile')

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <div className="pointer-events-none fixed -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-blue-700/25 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-44 -right-40 h-[34rem] w-[34rem] rounded-full bg-emerald-500/20 blur-3xl" />
      {!isWorkspaceRoute ? <Navbar currentPath={currentPath} /> : null}
      <main className="relative z-10 flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ✅ Public resource routes - anyone can view */}
          <Route path="/resources" element={<ResourceListPage />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['USER']} />}>
              <Route element={<UserDashboardLayout />}>
                <Route path="/dashboard/user" element={<UserDashboardPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
              </Route>
            </Route>

            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
              <Route element={<AdminDashboardLayout />}>
                <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
                {/* ✅ Admin resource management - only admin can access */}
                <Route path="/dashboard/admin/resources" element={<AdminResourcePanel />} />
              </Route>
            </Route>
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isWorkspaceRoute ? <Footer /> : null}
    </div>
  )
}

export default App