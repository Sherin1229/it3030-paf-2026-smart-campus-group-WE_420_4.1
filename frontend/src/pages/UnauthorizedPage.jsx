import { Link } from 'react-router-dom'

const UnauthorizedPage = () => {
  return (
    <section className="info-page">
      <div className="container info-wrap">
        <p className="info-eyebrow">Access Restricted</p>
        <h1>Unauthorized</h1>
        <p className="info-lead">
          Your account does not have permission to view this page. Please return to a permitted
          area.
        </p>
        <Link className="btn btn-primary" to="/">
          Back to Home
        </Link>
      </div>
    </section>
  )
}

export default UnauthorizedPage
