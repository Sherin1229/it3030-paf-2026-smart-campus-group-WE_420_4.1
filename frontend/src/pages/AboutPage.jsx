const AboutPage = () => {
  return (
    <section className="info-page">
      <div className="container info-wrap">
        <p className="info-eyebrow">About Smart Campus Hub</p>
        <h1>Built to simplify campus operations</h1>
        <p className="info-lead">
          Smart Campus Hub is a centralized platform designed to make day-to-day campus
          operations faster, clearer, and more accountable.
        </p>

        <div className="info-grid">
          <article className="info-card">
            <h2>What we solve</h2>
            <p>
              Universities and institutes often manage resources, maintenance requests, and
              announcements in separate tools. Our platform unifies these workflows into one
              connected experience.
            </p>
          </article>

          <article className="info-card">
            <h2>Key capabilities</h2>
            <ul>
              <li>Resource and facility booking visibility</li>
              <li>Incident reporting and maintenance tracking</li>
              <li>Role-aware notifications for students and staff</li>
              <li>Operational insights for administrative teams</li>
            </ul>
          </article>

          <article className="info-card">
            <h2>Our approach</h2>
            <p>
              We focus on practical usability, clean workflows, and quick onboarding so teams
              can adopt the platform without long training cycles.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default AboutPage
