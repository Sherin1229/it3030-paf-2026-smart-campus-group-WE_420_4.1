const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {year} Smart Campus Hub</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
