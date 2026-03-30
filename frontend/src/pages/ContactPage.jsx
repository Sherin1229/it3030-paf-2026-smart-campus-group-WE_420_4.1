const ContactPage = () => {
  return (
    <section className="info-page">
      <div className="container info-wrap">
        <p className="info-eyebrow">Contact Us</p>
        <h1>We are here to help</h1>
        <p className="info-lead">
          Reach out for product support, onboarding assistance, or collaboration opportunities.
        </p>

        <div className="contact-grid">
          <article className="info-card">
            <h2>Support Desk</h2>
            <p>Email: support@smartcampushub.edu</p>
            <p>Phone: +94 11 234 5678</p>
            <p>Hours: Mon-Fri, 8:30 AM - 5:30 PM</p>
          </article>

          <article className="info-card">
            <h2>Partnerships</h2>
            <p>Email: partnerships@smartcampushub.edu</p>
            <p>For institutional collaborations, pilot programs, and demos.</p>
          </article>

          <article className="info-card">
            <h2>Office Address</h2>
            <p>Smart Campus Hub Team</p>
            <p>Innovation Center, University Avenue</p>
            <p>Colombo, Sri Lanka</p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default ContactPage
