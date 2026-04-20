import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

const UserDashboardPage = () => {
  const { user } = useAuth()

  const quickLinks = [
    {
      title: 'View Profile',
      text: 'Update your personal details and preferences.',
      link: '/profile',
    },
    {
      title: 'Manage Bookings',
      text: 'Head to the Bookings tab to request resources.',
      link: '/dashboard/user/bookings',
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
        User Dashboard
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Welcome back, {user?.name || 'User'}</h1>
      <p className="mt-2 max-w-3xl text-slate-300">
        Manage your own campus booking requests, track statuses, and keep your schedule organized.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {quickLinks.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className="group rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-5 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/20"
          >
            <h2 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
              {action.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300">{action.text}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">Account Snapshot</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Role</p>
            <p className="mt-1 text-sm font-semibold text-white">{user?.role}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Provider</p>
            <p className="mt-1 text-sm font-semibold text-white">{user?.provider}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Pending Bookings</p>
            <p className="mt-1 text-sm font-semibold text-white">04</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Approved This Month</p>
            <p className="mt-1 text-sm font-semibold text-white">12</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default UserDashboardPage
