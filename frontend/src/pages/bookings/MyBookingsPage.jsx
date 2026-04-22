import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const STATUS_COLORS = {
  PENDING:  { bg: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',  dot: 'bg-amber-400' },
  APPROVED: { bg: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20', dot: 'bg-emerald-400' },
  REJECTED: { bg: 'bg-rose-500/10 text-rose-300 ring-rose-500/20', dot: 'bg-rose-400' },
}

const sampleBookings = [
  { id: 'BK-1001', resource: 'Main Lecture Hall', date: '2026-04-25', startTime: '09:00', endTime: '11:00', purpose: 'Guest lecture on Quantum Computing', status: 'PENDING', createdAt: '2026-04-20' },
  { id: 'BK-1002', resource: 'Advanced AI Lab',   date: '2026-04-22', startTime: '14:00', endTime: '16:00', purpose: 'ML Project Demo',                  status: 'APPROVED', createdAt: '2026-04-18' },
  { id: 'BK-1003', resource: 'Conference Room A', date: '2026-04-20', startTime: '10:00', endTime: '11:30', purpose: 'Team standup meeting',              status: 'APPROVED', createdAt: '2026-04-17' },
  { id: 'BK-1004', resource: 'Digital Projector Pro', date: '2026-04-18', startTime: '13:00', endTime: '15:00', purpose: 'Workshop presentation', status: 'REJECTED', createdAt: '2026-04-15' },
]

const MyBookingsPage = () => {
  const { user } = useAuth()
  const [bookings] = useState(sampleBookings)
  const [filter, setFilter] = useState('ALL')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)

  const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0 }
  bookings.forEach(b => counts[b.status]++)

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
            My Bookings
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Your Reservations</h1>
          <p className="mt-2 text-slate-300">
            Track and manage all your campus booking requests, {user?.name || 'User'}.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-amber-300">{counts.PENDING}</p>
          <p className="mt-1 text-xs font-medium text-slate-400">Pending</p>
        </div>
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-300">{counts.APPROVED}</p>
          <p className="mt-1 text-xs font-medium text-slate-400">Approved</p>
        </div>
        <div className="rounded-xl border border-rose-400/20 bg-rose-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-rose-300">{counts.REJECTED}</p>
          <p className="mt-1 text-xs font-medium text-slate-400">Rejected</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              filter === tab
                ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
          >
            {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            <span className="ml-2 opacity-60">
              {tab === 'ALL' ? bookings.length : counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-200">No bookings found</h3>
            <p className="mt-1 max-w-sm text-xs text-slate-400">
              {filter === 'ALL'
                ? "You haven't made any reservations yet."
                : `No ${filter.toLowerCase()} bookings to display.`}
            </p>
            <Link
              to="/dashboard/user/bookings/create"
              className="mt-4 rounded-lg bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/30 transition-colors"
            >
              Create your first booking
            </Link>
          </div>
        ) : (
          filtered.map((booking) => {
            const color = STATUS_COLORS[booking.status]
            const isExpanded = expandedId === booking.id

            return (
              <motion.div
                key={booking.id}
                layout
                className="rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-white/15"
              >
                {/* Main Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  {/* Status dot */}
                  <div className={`h-3 w-3 shrink-0 rounded-full ${color.dot}`}></div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-sm font-semibold text-white">{booking.resource}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${color.bg}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {booking.date} &middot; {booking.startTime} – {booking.endTime}
                    </p>
                  </div>

                  {/* Chevron */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`shrink-0 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 px-5 pb-5 pt-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Booking ID</p>
                            <p className="mt-1 text-sm font-medium text-white">{booking.id}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Created</p>
                            <p className="mt-1 text-sm font-medium text-white">{booking.createdAt}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Purpose</p>
                            <p className="mt-1 text-sm text-slate-300">{booking.purpose}</p>
                          </div>
                        </div>

                        {booking.status === 'PENDING' && (
                          <div className="mt-4 flex flex-wrap gap-3">
                            <Link
                              to="/dashboard/user/bookings/create"
                              state={{ booking }}
                              className="rounded-lg border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 transition-colors"
                            >
                              Edit Request
                            </Link>
                            <button className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors">
                              Cancel Request
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.section>
  )
}

export default MyBookingsPage
