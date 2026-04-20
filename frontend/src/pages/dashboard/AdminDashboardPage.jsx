import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

const StatCard = ({ label, value, icon, color, delay }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`rounded-2xl border bg-white/5 p-5 ${color}`}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="opacity-60">{icon}</div>
    </div>
    <p className="mt-4 text-4xl font-bold text-white">{value}</p>
  </motion.article>
)

const AdminDashboardPage = () => {
  const { user } = useAuth()

  const stats = [
    {
      label: 'Pending Approvals',
      value: '12',
      color: 'border-amber-400/20',
      delay: 0.1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ),
    },
    {
      label: 'Active Resources',
      value: '34',
      color: 'border-emerald-400/20',
      delay: 0.2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
      ),
    },
    {
      label: 'Conflict Flags',
      value: '3',
      color: 'border-rose-400/20',
      delay: 0.3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      ),
    },
    {
      label: 'Approved Today',
      value: '28',
      color: 'border-sky-400/20',
      delay: 0.4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      ),
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
        Admin Dashboard
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Welcome, {user?.name || 'Admin'} 👋
      </h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Full operational visibility over campus booking workflows, resources and requests.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Approval Queue</h2>
          <Link
            to="/dashboard/admin/bookings"
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-200">Backend not yet connected</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">Once booking endpoints are live, the queue will be populated here in real-time.</p>
          <Link
            to="/dashboard/admin/bookings"
            className="mt-4 rounded-lg bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
          >
            Go to Manage Bookings
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

export default AdminDashboardPage
