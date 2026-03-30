import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const AUTH_STORAGE_KEY = 'smart-campus-auth'

const roleHome = {
  USER: '/dashboard/user',
  ADMIN: '/dashboard/admin',
}

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.email || !parsed?.role) return null
    return parsed
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  }, [user])

  const login = async ({ email, password, role = 'USER' }) => {
    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    const normalizedRole = role === 'ADMIN' ? 'ADMIN' : 'USER'
    const profile = {
      name: email.split('@')[0] || 'Campus User',
      email,
      role: normalizedRole,
      provider: 'LOCAL',
    }

    setUser(profile)
    return profile
  }

  const register = async ({ name, email, password, role = 'USER' }) => {
    if (!name || !email || !password) {
      throw new Error('Name, email and password are required.')
    }

    const normalizedRole = role === 'ADMIN' ? 'ADMIN' : 'USER'
    const profile = {
      name,
      email,
      role: normalizedRole,
      provider: 'LOCAL',
    }

    setUser(profile)
    return profile
  }

  const loginWithGoogle = async (role = 'USER') => {
    const normalizedRole = role === 'ADMIN' ? 'ADMIN' : 'USER'
    const profile = {
      name: normalizedRole === 'ADMIN' ? 'Campus Admin' : 'Campus User',
      email: normalizedRole === 'ADMIN' ? 'admin.google@campus.edu' : 'user.google@campus.edu',
      role: normalizedRole,
      provider: 'GOOGLE',
    }

    setUser(profile)
    return profile
  }

  const logout = () => setUser(null)

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      loginWithGoogle,
      logout,
      roleHome,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }
  return context
}
