import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const UserDashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navItem = (path) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      location.pathname === path
        ? 'bg-sky-500 text-white shadow-md shadow-sky-900/40'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`

  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join('')
    : 'U'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-white">User Workspace</p>
            <span className="hidden text-xs text-slate-400 sm:inline">Booking access and personal tracking</span>
          </div>

          <nav className="flex items-center gap-1">
            <Link to="/dashboard/user" className={navItem('/dashboard/user')}>
              Dashboard
            </Link>
            <Link to="/profile" className={navItem('/profile')}>
              Profile
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/20 text-xs font-bold text-sky-200"
              aria-label="Open profile"
              title="Profile"
            >
              {initials}
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-rose-400/40 bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/30"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default UserDashboardLayout
