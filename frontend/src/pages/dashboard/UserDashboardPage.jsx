import { useAuth } from '../../context/AuthContext'

const UserDashboardPage = () => {
  const { user } = useAuth()

  return (
    <section className="px-4 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <p className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
          User Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Welcome, {user?.name || 'User'}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          This area is protected for USER role. Here you can request and track bookings for campus
          resources.
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
              Create bookings, view personal bookings, and monitor request status.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default UserDashboardPage
