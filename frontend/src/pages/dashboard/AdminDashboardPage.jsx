import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import resourceService from '../../api/resourceService'

const StatCard = ({ label, value, icon, color, delay }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-white/10 hover:bg-slate-900/60`}
  >
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-400`}>
        {icon}
      </div>
    </div>
    <p className="mt-4 text-4xl font-black text-white tracking-tighter">{value}</p>
  </motion.article>
)

const AdminDashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    pending: 0,
    totalResources: 0,
    activeResources: 0,
    recentBookings: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [resources, bookingsResponse] = await Promise.all([
        resourceService.getAllResources(),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/bookings`).then(res => res.json())
      ])

      setStats({
        pending: bookingsResponse.filter(b => b.status === 'PENDING').length,
        totalResources: resources.length,
        activeResources: resources.filter(r => r.status === 'ACTIVE').length,
        recentBookings: bookingsResponse.slice(0, 5).map(b => ({
          id: b.id,
          user: b.requesterEmail,
          resource: b.resourceName,
          status: b.status,
          date: b.date
        }))
      })
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      label: 'Pending Requests',
      value: stats.pending,
      color: 'amber',
      delay: 0.1,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    },
    {
      label: 'Total Resources',
      value: stats.totalResources,
      color: 'sky',
      delay: 0.2,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
    },
    {
      label: 'Active Facilities',
      value: stats.activeResources,
      color: 'emerald',
      delay: 0.3,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    },
    {
      label: 'System Load',
      value: 'Optimal',
      color: 'purple',
      delay: 0.4,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    }
  ]

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Operational Overview</p>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="mt-2 text-slate-400 max-w-lg leading-relaxed text-sm">
            You have <span className="text-amber-400 font-bold">{stats.pending} pending requests</span> that need your attention today.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/dashboard/admin/resources/create')}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            New Resource
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-2xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Recent Booking Requests
            </h2>
            <Link to="/dashboard/admin/bookings" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              View All Requests →
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-20 text-center text-slate-500">Loading activity...</div>
            ) : stats.recentBookings.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-white/5">
                <p className="text-slate-500 text-sm">No recent booking activity found.</p>
              </div>
            ) : (
              stats.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/10 group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                      {booking.user.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold group-hover:text-emerald-400 transition-colors">{booking.user.split('@')[0]}</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-tighter">{booking.resource} • {booking.date}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full ring-1 ring-inset ${
                    booking.status === 'PENDING' 
                      ? 'bg-amber-500/10 text-amber-400 ring-amber-500/20' 
                      : booking.status === 'APPROVED' 
                      ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions / Shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl"
        >
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
            Quick Actions
          </h2>
          <div className="grid gap-3">
            {[
              { label: 'System Analytics', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>, path: '/dashboard/admin/analytics', color: 'emerald' },
              { label: 'Pending Approvals', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, path: '/dashboard/admin/bookings', color: 'amber' },
              { label: 'Manage Resources', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, path: '/dashboard/admin/resources', color: 'sky' },
              { label: 'Global Search', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>, path: '/dashboard/admin/resources', color: 'rose' }
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-4 w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm font-bold text-slate-300 transition hover:bg-emerald-500 hover:text-white group"
              >
                <div className={`h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white/20 group-hover:text-white transition-colors`}>
                  {action.icon}
                </div>
                {action.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
