const ContactPage = () => {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <p className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
          Contact Us
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          We are here to help
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Reach out for product support, onboarding assistance, or collaboration opportunities.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Support Desk</h2>
            <p className="mt-2 text-sm text-slate-300">Email: support@smartcampushub.edu</p>
            <p className="text-sm text-slate-300">Phone: +94 11 234 5678</p>
            <p className="text-sm text-slate-300">Hours: Mon-Fri, 8:30 AM - 5:30 PM</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Partnerships</h2>
            <p className="mt-2 text-sm text-slate-300">Email: partnerships@smartcampushub.edu</p>
            <p className="text-sm text-slate-300">For institutional collaborations, pilot programs, and demos.</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Office Address</h2>
            <p className="mt-2 text-sm text-slate-300">Smart Campus Hub Team</p>
            <p className="text-sm text-slate-300">Innovation Center, University Avenue</p>
            <p className="text-sm text-slate-300">Colombo, Sri Lanka</p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default ContactPage
