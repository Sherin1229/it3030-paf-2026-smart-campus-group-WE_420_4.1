import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const UserBookingsPage = () => {
  const bookingActions = [
    {
      title: 'Request New Booking',
      text: 'Reserve labs, halls or equipment in a few clicks.',
      link: '/dashboard/user/bookings/create',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><line x1="12" x2="12" y1="14" y2="18"></line><line x1="10" x2="14" y1="16" y2="16"></line></svg>
      )
    },
    {
      title: 'My Bookings',
      text: 'Monitor approvals and responses for your submissions.',
      link: '#', // Placeholder for list view
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      )
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
            Bookings
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Booking Management</h1>
          <p className="mt-2 text-slate-300">
            Request new resources and track your existing bookings.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {bookingActions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-sky-500/50 hover:bg-sky-500/10"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
              {action.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white group-hover:text-sky-300 transition-colors">
                {action.title}
              </h2>
              <p className="mt-1 text-sm text-slate-400">{action.text}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Recent Booking History</h2>
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-200">No bookings yet</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">When you request a resource, its status will appear here.</p>
        </div>
      </div>
    </motion.section>
  )
}

export default UserBookingsPage
