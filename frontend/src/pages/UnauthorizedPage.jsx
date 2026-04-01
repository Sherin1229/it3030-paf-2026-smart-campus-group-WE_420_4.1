import { Link } from 'react-router-dom'

const UnauthorizedPage = () => {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <p className="inline-flex rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-300">
          Access Restricted
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Unauthorized
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Your account does not have permission to view this page. Please return to a permitted
          area.
        </p>
        <Link
          className="mt-5 inline-flex rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
          to="/"
        >
          Back to Home
        </Link>
      </div>
    </section>
  )
}

export default UnauthorizedPage
