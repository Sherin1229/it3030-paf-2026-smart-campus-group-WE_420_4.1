import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PublicOnlyRoute = () => {
  const { isAuthenticated, user, roleHome } = useAuth()

  if (!isAuthenticated) {
    return <Outlet />
  }

  return <Navigate to={roleHome[user.role] || '/'} replace />
}

export default PublicOnlyRoute
