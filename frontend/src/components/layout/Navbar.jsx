import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const Navbar = ({ currentPath }) => {
  const { isAuthenticated, user, logout, roleHome } = useAuth()
  const isActive = (path) => (currentPath === path ? 'nav-link active' : 'nav-link')
  const isActionActive = (path, className) =>
    currentPath === path ? `${className} active` : className

  const dashboardPath = user ? roleHome[user.role] || '/' : '/'

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link className="brand" to="/" aria-label="Smart Campus Hub Home">
          <span className="brand-icon">SC</span>
          Smart Campus Hub
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
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

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="nav-user-pill">{user.name} ({user.role})</span>
              <button className="nav-btn nav-btn-logout" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={isActionActive('/login', 'nav-btn nav-btn-login')} to="/login">
                Login
              </Link>
              <Link className={isActionActive('/register', 'nav-btn nav-btn-register')} to="/register">
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
