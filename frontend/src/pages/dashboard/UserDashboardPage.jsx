import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import resourceService from '../../api/resourceService'

const QuickAction = ({ title, text, link, icon, color }) => (
  <Link
    to={link}
    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-indigo-500/30 hover:bg-slate-900/60"
  >
    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
      {title}
    </h2>
    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{text}</p>
    <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
  </Link>
)

const UserDashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalBookings: 0,
    approvedBookings: 0,
    pendingBookings: 0
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/bookings/user/${user?.email}`)
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalBookings: data.length,
          approvedBookings: data.filter(b => b.status === 'APPROVED').length,
          pendingBookings: data.filter(b => b.status === 'PENDING').length
        })
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err)
    }
  }

  const actions = [
    {
      title: 'Book a Resource',
      text: 'Browse available laboratories, halls, and equipment for your academic projects.',
      link: '/dashboard/user/resources',
      color: 'indigo',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    },
    {
      title: 'My Bookings',
      text: 'View your scheduled facilities and check current request statuses.',
      link: '/dashboard/user/bookings/my',
      color: 'emerald',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
    },
    {
      title: 'Self Check-in',
      text: 'Quickly scan a resource QR code to mark your attendance and occupancy.',
      link: '/dashboard/user/bookings/scan',
      color: 'amber',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M7 7h1v1H7z"/><path d="M7 16h1v1H7z"/><path d="M16 7h1v1H16z"/><path d="M16 16h1v1H16z"/></svg>
    },
    {
      title: 'Profile Settings',
      text: 'Update your contact information and notification preferences.',
      link: '/profile',
      color: 'rose',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    }
  ]

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Student Hub</p>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="mt-2 text-slate-400 max-w-lg leading-relaxed text-sm">
          Everything you need to manage your campus academic environment in one place.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Active Bookings', value: stats.pendingBookings, color: 'text-amber-400' },
          { label: 'Total Scheduled', value: stats.totalBookings, color: 'text-indigo-400' },
          { label: 'Approved', value: stats.approvedBookings, color: 'text-emerald-400' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`${stat.color} text-3xl font-black`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Grid of Actions */}
      <div className="grid gap-6 sm:grid-cols-2">
        {actions.map((action, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <QuickAction {...action} />
          </motion.div>
        ))}
      </div>

      {/* Account Snapshot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Account Identity
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Campus ID</p>
              <p className="text-sm font-bold text-white">{user?.email}</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/5 p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role Access</p>
              <p className="text-sm font-bold text-white">{user?.role} Level Access</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default UserDashboardPage
