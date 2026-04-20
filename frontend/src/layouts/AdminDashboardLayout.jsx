import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

const AdminDashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItem = (path) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
      location.pathname === path
        ? 'bg-emerald-500/20 text-emerald-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ring-1 ring-emerald-500/30'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
    }`

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden w-72 shrink-0 border-r border-white/5 bg-slate-900/60 p-6 backdrop-blur-xl lg:flex lg:flex-col"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Admin Panel</p>
            <h2 className="text-lg font-bold text-white">Operations</h2>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          <Link to="/dashboard/admin" className={navItem('/dashboard/admin')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
            Overview
          </Link>
          <Link to="/dashboard/admin/bookings" className={navItem('/dashboard/admin/bookings')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Manage Bookings
          </Link>
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="text-sm font-semibold text-white">{user?.name || 'Admin User'}</p>
          <p className="text-xs text-emerald-300">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg border border-rose-400/40 bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/30"
          >
            Logout
          </button>
          <Link to="/" className="mt-2 inline-block text-xs text-slate-400 hover:text-white">
            Back to public site
          </Link>
        </div>
      </motion.aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white">Admin Panel</p>
            <button
              onClick={handleLogout}
              className="rounded-md border border-rose-400/40 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-200"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardLayout
