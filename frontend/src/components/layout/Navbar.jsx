const Navbar = ({ currentPath }) => {
  const isActive = (path) => (currentPath === path ? 'nav-link active' : 'nav-link')
  const isActionActive = (path, className) =>
    currentPath === path ? `${className} active` : className

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <a className="brand" href="/" aria-label="Smart Campus Hub Home">
          Smart Campus Hub
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a className={isActive('/')} href="/">
            Home
          </a>
          <a className={isActive('/about')} href="/about">
            About
          </a>
          <a className={isActive('/contact')} href="/contact">
            Contact Us
          </a>
        </nav>

        <div className="nav-actions">
          <a className={isActionActive('/login', 'nav-btn nav-btn-login')} href="/login">
            Login
          </a>
          <a className={isActionActive('/register', 'nav-btn nav-btn-register')} href="/register">
            Register
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar
