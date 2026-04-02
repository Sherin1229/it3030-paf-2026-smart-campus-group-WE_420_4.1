import { useAuth } from '../../context/AuthContext'

const UserProfilePage = () => {
  const { user } = useAuth()

  const profileRows = [
    ['Full Name', user?.name || 'Campus User'],
    ['Email', user?.email || 'user@campus.edu'],
    ['Role', user?.role || 'USER'],
    ['Login Provider', user?.provider || 'LOCAL'],
  ]

  return (
    <section>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/20 text-xl font-bold text-sky-200">
            {user?.name?.slice(0, 1)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">User Profile</p>
            <h1 className="text-2xl font-bold text-white">{user?.name || 'Campus User'}</h1>
            <p className="text-sm text-slate-400">Manage your identity and account details.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {profileRows.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UserProfilePage
