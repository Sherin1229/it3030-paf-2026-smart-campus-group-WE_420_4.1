import { useAuth } from '../../context/AuthContext'

const UserDashboardPage = () => {
  const { user } = useAuth()

  return (
    <section className="dashboard-page">
      <div className="container dashboard-wrap">
        <p className="info-eyebrow">User Dashboard</p>
        <h1>Welcome, {user?.name || 'User'}</h1>
        <p className="info-lead">
          This area is protected for USER role. Here you can request and track bookings for campus
          resources.
        </p>

        <div className="info-grid">
          <article className="info-card">
            <h2>My Role</h2>
            <p>{user?.role}</p>
          </article>
          <article className="info-card">
            <h2>Auth Provider</h2>
            <p>{user?.provider}</p>
          </article>
          <article className="info-card">
            <h2>Access Scope</h2>
            <p>Create bookings, view personal bookings, and monitor request status.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default UserDashboardPage
