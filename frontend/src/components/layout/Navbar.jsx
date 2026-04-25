import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const Navbar = ({ currentPath }) => {
  const { isAuthenticated, user, logout, roleHome } = useAuth()
  const baseNavLink =
    'rounded-full border border-transparent px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:border-white/10 hover:bg-white/10 hover:text-white'
  const isActive = (path) =>
    currentPath === path
      ? `${baseNavLink} border-blue-400/40 bg-blue-500/25 text-white`
      : baseNavLink

  const loginClasses =
    'rounded-lg border px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5 border-blue-400/30 bg-blue-500/15 text-blue-200'
  const registerClasses =
    'rounded-lg border border-emerald-400/40 bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:-translate-y-0.5'
  const logoutClasses =
    'rounded-lg border border-rose-300/40 bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:-translate-y-0.5'

  const dashboardPath = user ? roleHome[user.role] || '/' : '/'

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:py-4">
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-white"
          to="/"
          aria-label="Smart Campus Hub Home"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 to-blue-500 text-[11px] font-extrabold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]">
            SC
          </span>
          Smart Campus Hub
        </Link>

        <nav className="flex w-full items-center gap-1 overflow-x-auto md:mx-auto md:w-auto" aria-label="Main navigation">
          <Link className={isActive('/')} to="/">
            Home
          </Link>
          <Link className={isActive('/about')} to="/about">
            About
          </Link>
          <Link className={isActive('/contact')} to="/contact">
            Contact Us
          </Link>
          {isAuthenticated ? (
            <Link className={isActive(dashboardPath)} to={dashboardPath}>
              Dashboard
            </Link>
          ) : null}
        </nav>

        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
          {isAuthenticated ? (
            <>
              <span className="rounded-full border border-slate-500/40 bg-slate-600/20 px-3 py-1 text-xs font-semibold text-slate-200">
                {user.name} ({user.role})
              </span>
              <button className={logoutClasses} onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className={`${loginClasses} ${currentPath === '/login' ? 'border-blue-300/70 bg-blue-500/30 text-white' : ''}`}
                to="/login"
              >
                Login
              </Link>
              <Link
                className={`${registerClasses} ${currentPath === '/register' ? 'ring-2 ring-emerald-300/40' : ''}`}
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
