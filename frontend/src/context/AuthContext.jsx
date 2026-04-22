import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const AUTH_STORAGE_KEY = 'smart-campus-auth'
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/auth`

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

  const sendAuthRequest = async (path, payload) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const responseBody = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(responseBody?.message || 'Authentication request failed.')
    }

    return responseBody
  }

  useEffect(() => {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  }, [user])

  const login = async ({ email, password }) => {
    const profile = await sendAuthRequest('/login', { email, password })
    setUser(profile)
    return profile
  }

  const register = async ({ name, email, password }) => {
    const profile = await sendAuthRequest('/register', { name, email, password })
    setUser(profile)
    return profile
  }

  const loginWithGoogle = async (idToken) => {
    const profile = await sendAuthRequest('/google', { idToken })
    setUser(profile)
    return profile
  }

  const forgotPassword = async (email) => {
    await sendAuthRequest('/forgot-password', { email })
  }

  const verifyOtp = async (email, otp) => {
    await sendAuthRequest('/verify-otp', { email, otp })
  }

  const resetPassword = async (email, otp, newPassword) => {
    await sendAuthRequest('/reset-password', { email, otp, newPassword })
  }

  const logout = () => setUser(null)

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      loginWithGoogle,
      forgotPassword,
      verifyOtp,
      resetPassword,
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
