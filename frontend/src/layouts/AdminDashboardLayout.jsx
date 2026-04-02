import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminDashboardLayout = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-900/80 p-4 lg:flex lg:flex-col">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Admin Panel</p>
          <h2 className="mt-2 text-xl font-bold text-white">Operations Control</h2>
          <p className="mt-1 text-sm text-slate-400">Review and manage all booking workflows.</p>
        </div>

        <nav className="mt-6 space-y-2">
          <button className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-left text-sm font-semibold text-white shadow-md shadow-emerald-900/40">
            Overview
          </button>
        </nav>

        <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3">
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
      </aside>

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
