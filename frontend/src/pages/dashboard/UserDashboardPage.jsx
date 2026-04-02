import { useAuth } from '../../context/AuthContext'

const UserDashboardPage = () => {
  const { user } = useAuth()

  const quickActions = [
    ['Request New Booking', 'Reserve labs, halls or equipment in a few clicks.'],
    ['Track Pending Requests', 'Monitor approvals and responses for your submissions.'],
    ['View Recent Activity', 'See what changed in your booking timeline.'],
  ]

  return (
    <section>
      <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
        User Dashboard
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Welcome back, {user?.name || 'User'}</h1>
      <p className="mt-2 max-w-3xl text-slate-300">
        Manage your own campus booking requests, track statuses, and keep your schedule organized.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {quickActions.map(([title, text]) => (
          <article key={title} className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-5">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-300">{text}</p>
          </article>
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
    </section>
  )
}

export default UserDashboardPage
