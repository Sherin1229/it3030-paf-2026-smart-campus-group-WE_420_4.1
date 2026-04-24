import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { QRCodeSVG } from 'qrcode.react'

const STATUS_COLORS = {
  PENDING:  { bg: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',  dot: 'bg-amber-400' },
  APPROVED: { bg: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20', dot: 'bg-emerald-400' },
  REJECTED: { bg: 'bg-rose-500/10 text-rose-300 ring-rose-500/20', dot: 'bg-rose-400' },
}

const BOOKING_API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://10.50.20.47:8081/api'}/bookings`

const MyBookingsPage = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.email) return
      
      try {
        setLoading(true)
        const response = await fetch(`${BOOKING_API_BASE_URL}/my?email=${encodeURIComponent(user.email)}`)
        if (!response.ok) throw new Error('Failed to fetch bookings')
        const data = await response.json()
        setBookings(data)
      } catch (err) {
        setError(err.message || 'Something went wrong while loading your bookings.')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user?.email])

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)

  const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0 }
  bookings.forEach(b => {
    if (counts[b.status] !== undefined) counts[b.status]++
  })

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
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 py-16 text-center">
            <svg className="h-8 w-8 animate-spin text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-sm text-slate-400 font-medium">Fetching your reservations...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-6 text-center">
            <p className="text-sm font-medium text-rose-300">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-xs font-bold text-white underline underline-offset-4"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
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
                      <h3 className="text-sm font-semibold text-white">{booking.resourceName}</h3>
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
                            <p className="mt-1 text-sm font-medium text-white">{booking.bookingCode}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Created</p>
                            <p className="mt-1 text-sm font-medium text-white">
                              {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '---'}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Purpose</p>
                            <p className="mt-1 text-sm text-slate-300">{booking.purpose}</p>
                          </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-white/5 p-6 border border-white/5 sm:flex-row sm:justify-start sm:gap-6">
                          <div className="rounded-xl bg-white p-3 shadow-xl shadow-sky-500/10">
                            <QRCodeSVG 
                              value={`http://10.50.20.47:5173/verify-booking?code=${booking.bookingCode}`}
                              size={100}
                              level="H"
                              includeMargin={false}
                              imageSettings={{
                                src: "/logo.png",
                                x: undefined,
                                y: undefined,
                                height: 20,
                                width: 20,
                                excavate: true,
                              }}
                            />
                          </div>
                          <div className="mt-4 text-center sm:mt-0 sm:text-left">
                            <h4 className="text-sm font-bold text-white">Digital Pass</h4>
                            <p className="mt-1 text-xs text-slate-400 max-w-[200px]">
                              Show this QR code at the {booking.resourceName} entrance for quick verification.
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-sky-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                              Verified Secure
                            </div>
                          </div>
                        </div>

                        {booking.status === 'PENDING' && (
                          <div className="mt-6 flex flex-wrap gap-3">
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
