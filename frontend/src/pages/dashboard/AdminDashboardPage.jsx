import { useAuth } from '../../context/AuthContext'

const AdminDashboardPage = () => {
  const { user } = useAuth()

  return (
    <section className="dashboard-page">
      <div className="container dashboard-wrap">
        <p className="info-eyebrow">Admin Dashboard</p>
        <h1>Welcome, {user?.name || 'Admin'}</h1>
        <p className="info-lead">
          This area is protected for ADMIN role. You can review booking requests and make approval
          decisions.
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
            <p>View all booking requests, approve or reject, and manage booking conflicts.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboardPage
