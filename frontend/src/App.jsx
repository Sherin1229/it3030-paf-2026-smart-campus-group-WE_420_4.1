import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

function App() {
  const path = window.location.pathname.toLowerCase()
  let page

  if (path === '/login') {
    page = <LoginPage />
  } else if (path === '/register') {
    page = <RegisterPage />
  } else if (path === '/about') {
    page = <AboutPage />
  } else if (path === '/contact') {
    page = <ContactPage />
  } else {
    page = <HomePage />
  }

  return (
    <div className="app-shell">
      <Navbar currentPath={path} />
      <main className="app-main">{page}</main>
      <Footer />
    </div>
  )
}

export default App
