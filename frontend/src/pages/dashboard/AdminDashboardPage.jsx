import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import resourceService from '../../api/resourceService'

const cardStyles = {
  amber: 'border-amber-400/20 text-amber-300',
  emerald: 'border-emerald-400/20 text-emerald-300',
  rose: 'border-rose-400/20 text-rose-300',
  sky: 'border-sky-400/20 text-sky-300',
}

const StatCard = ({ label, value, tone, icon, delay }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className={`rounded-2xl border bg-slate-900/40 p-6 backdrop-blur-xl ${cardStyles[tone]}`}
  >
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <div className="opacity-70">{icon}</div>
    </div>
    <p className="mt-4 text-3xl font-black text-white tracking-tight">{value}</p>
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
    recentBookings: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'
      const [adminStatsResponse, resources, bookingsResponse] = await Promise.all([
        fetch(`${apiBase}/dashboard/admin/stats`),
        resourceService.getAllResources(),
        fetch(`${apiBase}/bookings`).then((res) => (res.ok ? res.json() : [])),
      ])

      if (adminStatsResponse.ok) {
        const adminStats = await adminStatsResponse.json()
        setStatsData(adminStats)
      }

      const bookings = Array.isArray(bookingsResponse) ? bookingsResponse : []
      const resourcesList = Array.isArray(resources) ? resources : []

      setStats({
        pending: bookings.filter((b) => b.status === 'PENDING').length,
        totalResources: resourcesList.length,
        activeResources: resourcesList.filter((r) => r.status === 'ACTIVE').length,
        recentBookings: bookings.slice(0, 5).map((b) => ({
          id: b.id,
          user: b.requesterEmail,
          resource: b.resourceName,
          status: b.status,
          date: b.date,
        })),
      })
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      label: 'Pending Approvals',
      value: statsData?.pendingApprovals ?? stats.pending,
      tone: 'amber',
      delay: 0.1,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    },
    {
      label: 'Active Resources',
      value: statsData?.activeResources ?? stats.activeResources,
      tone: 'emerald',
      delay: 0.2,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
    },
    {
      label: 'Conflict Flags',
      value: statsData?.conflictFlags ?? 0,
      tone: 'rose',
      delay: 0.3,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    },
    {
      label: 'Approved Today',
      value: statsData?.approvedToday ?? 0,
      tone: 'sky',
      delay: 0.4,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    },
  ]

  return (
    <div className="space-y-8 pb-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Operational Overview</p>
          <h1 className="text-4xl font-black text-white tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
            You have <span className="font-bold text-amber-400">{stats.pending} pending requests</span> that need your attention today.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/admin/resources/create')}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
          New Resource
        </button>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Recent Booking Requests
          </h2>
          <Link to="/dashboard/admin/bookings" className="text-xs font-bold text-emerald-400 transition-colors hover:text-emerald-300">
            View All Requests {'->'}
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading activity...</div>
        ) : stats.recentBookings.length === 0 ? (
          <div className="py-10 text-center text-slate-500">No recent booking activity</div>
        ) : (
          <div className="space-y-4">
            {stats.recentBookings.map((booking) => (
              <div key={booking.id} className="flex justify-between rounded-xl bg-white/5 p-4">
                <div>
                  <p className="text-sm font-bold text-white">{(booking.user || '').split('@')[0] || 'User'}</p>
                  <p className="text-xs text-slate-400">{booking.resource} | {booking.date}</p>
                </div>
                <span className="text-xs text-amber-400">{booking.status}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminDashboardPage
