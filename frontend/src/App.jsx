import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UserDashboardPage from './pages/dashboard/UserDashboardPage'
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'
import PublicOnlyRoute from './routes/PublicOnlyRoute'

function App() {
  const location = useLocation()
  const currentPath = location.pathname.toLowerCase()

  return (
    <div className="app-shell">
      <Navbar currentPath={currentPath} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['USER']} />}>
              <Route path="/dashboard/user" element={<UserDashboardPage />} />
            </Route>
            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
              <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
