import { useAuth } from '../../context/AuthContext'

const AdminDashboardPage = () => {
  const { user } = useAuth()

  return (
    <section>
      <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
        Admin Dashboard
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Operations Overview, {user?.name || 'Admin'}</h1>
      <p className="mt-2 max-w-3xl text-slate-300">
        Review campus booking demand, resolve conflicts, and take approval actions with full visibility.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Pending Approvals</p>
          <p className="mt-2 text-sm font-semibold text-slate-300">No data available</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Active Resources</p>
          <p className="mt-2 text-sm font-semibold text-slate-300">No data available</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Conflict Flags</p>
          <p className="mt-2 text-sm font-semibold text-slate-300">No data available</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Rejected Today</p>
          <p className="mt-2 text-sm font-semibold text-slate-300">No data available</p>
        </article>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Approval Queue</h2>
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-300">
          No approval records to display yet. Connect this view to backend data when endpoints are ready.
        </div>
      </div>
    </section>
  )
}

export default AdminDashboardPage
