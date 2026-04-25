const AboutPage = () => {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
          About Smart Campus Hub
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Built to simplify campus operations
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Smart Campus Hub is a centralized platform designed to make day-to-day campus
          operations faster, clearer, and more accountable.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">What we solve</h2>
            <p className="mt-2 text-sm text-slate-300">
              Universities and institutes often manage resources, maintenance requests, and
              announcements in separate tools. Our platform unifies these workflows into one
              connected experience.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Key capabilities</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Resource and facility booking visibility</li>
              <li>Incident reporting and maintenance tracking</li>
              <li>Role-aware notifications for students and staff</li>
              <li>Operational insights for administrative teams</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Our approach</h2>
            <p className="mt-2 text-sm text-slate-300">
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
