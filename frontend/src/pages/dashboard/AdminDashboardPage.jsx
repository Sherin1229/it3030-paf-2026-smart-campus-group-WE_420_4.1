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

const [statsData, setStatsData] = useState(null)

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
    console.log('Fetching dashboard data...')

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'
    
    // Fetch stats, resources, and bookings in parallel
    const [statsRes, resData, bookingsRes] = await Promise.allSettled([
      fetch(`${baseUrl}/dashboard/admin/stats`).then(r => r.ok ? r.json() : Promise.reject('Stats failed')),
      resourceService.getAllResources(),
      fetch(`${baseUrl}/bookings`).then(r => r.ok ? r.json() : Promise.reject('Bookings failed'))
    ])

    if (statsRes.status === 'fulfilled') {
      setStatsData(statsRes.value)
    } else {
      console.error('Stats fetch failed:', statsRes.reason)
    }

    const resources = resData.status === 'fulfilled' ? resData.value : []
    const bookings = bookingsRes.status === 'fulfilled' ? bookingsRes.value : []

    setStats({
      pending: statsRes.status === 'fulfilled' ? statsRes.value.pendingApprovals : bookings.filter(b => b.status === 'PENDING').length,
      totalResources: resources.length,
      activeResources: resources.filter(r => r.status === 'ACTIVE').length,
      recentBookings: Array.isArray(bookings) ? bookings.slice(0, 5).map(b => ({
        id: b.id,
        user: b.requesterEmail,
        resource: b.resourceName,
        status: b.status,
        date: b.date
      })) : []
    })
  } catch (err) {
    console.error('Critical failure in fetchDashboardData:', err)
  } finally {
    setLoading(false)
  }
}

  const cards = [
    {
      label: 'Pending Approvals',
      value: statsData?.pendingApprovals ?? '0',
      color: 'border-amber-400/20',
      delay: 0.1,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    },
    {
      label: 'Active Resources',
      value: statsData?.activeResources ?? '0',
      color: 'border-emerald-400/20',
      delay: 0.2,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
    },
    {
      label: 'Conflict Flags',
      value: statsData?.conflictFlags ?? '0',
      color: 'border-rose-400/20',
      delay: 0.3,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    },
    {
      label: 'Approved Today',
      value: statsData?.approvedToday ?? '0',
      color: 'border-sky-400/20',
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

<div className="mt-4 space-y-6">

  {/* 🔹 Pending Approvals Table */}
  <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
    {!statsData?.approvalQueue || statsData.approvalQueue.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-sm font-semibold text-slate-200">No pending approvals</h3>
        <p className="text-xs text-slate-400">Everything is caught up!</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="px-6 py-4">Resource</th>
              <th className="px-6 py-4">Requester</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {statsData.approvalQueue.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-white">{item.resourceName}</td>
                <td className="px-6 py-4 text-slate-300">{item.requesterEmail}</td>
                <td className="px-6 py-4 text-slate-300">{item.date}</td>
                <td className="px-6 py-4 text-slate-300">
                  {item.startTime} - {item.endTime}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to="/dashboard/admin/bookings"
                    className="text-emerald-400 text-xs font-semibold"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>

  {/* 🔹 Recent Activity */}
  <div className="space-y-4">
    {loading ? (
      <div className="py-10 text-center text-slate-500">Loading activity...</div>
    ) : stats.recentBookings.length === 0 ? (
      <div className="py-10 text-center text-slate-500">
        No recent booking activity
      </div>
    ) : (
      stats.recentBookings.map((booking) => (
        <div key={booking.id} className="flex justify-between bg-white/5 p-4 rounded-xl">
          <div>
            <p className="text-white text-sm font-bold">
              {booking.user.split('@')[0]}
            </p>
            <p className="text-slate-400 text-xs">
              {booking.resource} • {booking.date}
            </p>
          </div>
          <span className="text-xs text-amber-400">{booking.status}</span>
        </div>
      ))
    )}
  </div>

</div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
