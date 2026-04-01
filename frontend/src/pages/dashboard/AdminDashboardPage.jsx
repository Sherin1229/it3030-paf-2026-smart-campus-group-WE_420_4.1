import { useAuth } from '../../context/AuthContext'

const AdminDashboardPage = () => {
  const { user } = useAuth()

  return (
    <section className="px-4 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
          Admin Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Welcome, {user?.name || 'Admin'}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          This area is protected for ADMIN role. You can review booking requests and make approval
          decisions.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">My Role</h2>
            <p className="mt-2 text-sm text-slate-300">{user?.role}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Auth Provider</h2>
            <p className="mt-2 text-sm text-slate-300">{user?.provider}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Access Scope</h2>
            <p className="mt-2 text-sm text-slate-300">
              View all booking requests, approve or reject, and manage booking conflicts.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboardPage
