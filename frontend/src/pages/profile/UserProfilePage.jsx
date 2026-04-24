import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const UserProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookingCount, setBookingCount] = useState(0)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [pwdData, setPwdData] = useState({ current: '', new: '', confirm: '' })
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const API_BOOKINGS_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://10.50.20.47:8081/api'}/bookings/my?email=${user.email}`
      const response = await fetch(API_BOOKINGS_URL)
      if (response.ok) {
        const data = await response.json()
        setBookingCount(data.length)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      await updateProfile(user.email, { 
        name: formData.name, 
        bio: formData.bio 
      })
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwdData.new !== pwdData.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    setLoading(true)
    try {
      await changePassword(user.email, pwdData.current, pwdData.new)
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setIsChangingPassword(false)
      setPwdData({ current: '', new: '', confirm: '' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative group">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-sky-400/30 bg-sky-500/10 p-1 transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-900 text-3xl font-bold text-sky-400">
                {formData.name.slice(0, 1).toUpperCase() || 'U'}
              </div>
            </div>
            <button className="absolute -bottom-2 -right-2 rounded-lg bg-sky-500 p-2 text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">{formData.name}</h1>
                <p className="mt-1 flex items-center justify-center gap-2 text-sm font-medium text-slate-400 sm:justify-start">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {user?.role || 'USER'} Account • {user?.provider || 'LOCAL'}
                </p>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 active:scale-95"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mb-6 rounded-xl p-4 text-xs font-bold ${
                    message.type === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
            <h3 className="text-lg font-bold text-white">Personal Information</h3>
            <form onSubmit={handleUpdate} className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white focus:border-sky-500/50 focus:ring-0 disabled:opacity-50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  value={formData.email}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white/50 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">About Me</label>
                <textarea 
                  disabled={!isEditing}
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white focus:border-sky-500/50 focus:ring-0 disabled:opacity-50 transition-all resize-none"
                />
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="sm:col-span-2 flex justify-end"
                  >
                    <button 
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-3 text-sm font-black text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400 disabled:opacity-50"
                    >
                      {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                      {loading ? 'Saving Changes...' : 'Update Profile'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Security Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Security
            </h3>
            <p className="mt-2 text-xs text-slate-400">Keep your account secure by managing your password.</p>
            <button 
              onClick={() => setIsChangingPassword(true)}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-white transition hover:bg-white/10"
            >
              Change Password
            </button>
          </div>

          {/* Activity Status */}
          <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-6 backdrop-blur-md">
            <h3 className="text-md font-bold text-emerald-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
              Usage Stats
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Total Bookings</span>
                <span className="text-sm font-bold text-white">{bookingCount}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800">
                <div 
                  className="h-full rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-1000" 
                  style={{ width: `${Math.min(bookingCount * 10, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                {bookingCount > 0 ? `You have made ${bookingCount} bookings so far. Keep it up!` : 'Start booking resources to see your stats!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangingPassword && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChangingPassword(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <p className="mt-2 text-sm text-slate-400">Enter your current and new password below.</p>
              
              <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={pwdData.current}
                    onChange={(e) => setPwdData({...pwdData, current: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-500/50 focus:ring-0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={pwdData.new}
                    onChange={(e) => setPwdData({...pwdData, new: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-500/50 focus:ring-0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={pwdData.confirm}
                    onChange={(e) => setPwdData({...pwdData, confirm: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-500/50 focus:ring-0"
                  />
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-sky-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default UserProfilePage
