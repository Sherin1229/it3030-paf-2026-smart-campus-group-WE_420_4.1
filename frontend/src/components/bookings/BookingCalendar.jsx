import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DOT_COLORS = {
  Pending:  'bg-amber-400',
  Approved: 'bg-emerald-400',
  Rejected: 'bg-rose-400',
}

const STATUS_BG = {
  Pending:  'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20',
  Rejected: 'bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const BookingCalendar = ({ bookings = [] }) => {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(null)
  const [direction, setDirection] = useState(0)

  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const navigate = (delta) => {
    setDirection(delta)
    setViewDate(new Date(year, month + delta, 1))
    setSelectedDate(null)
  }

  const goToday = () => {
    setDirection(0)
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(null)
  }

  // Build calendar grid
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const prevDays = new Date(year, month, 0).getDate()

    const grid = []

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      grid.push({ day: prevDays - i, current: false, dateStr: null })
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      grid.push({ day: d, current: true, dateStr })
    }
    // Next month leading days
    const remaining = 42 - grid.length
    for (let d = 1; d <= remaining; d++) {
      grid.push({ day: d, current: false, dateStr: null })
    }

    return grid
  }, [year, month])

  // Build a map: dateStr -> bookings[]
  const bookingMap = useMemo(() => {
    const map = {}
    bookings.forEach(b => {
      if (!map[b.date]) map[b.date] = []
      map[b.date].push(b)
    })
    return map
  }, [bookings])

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const selectedBookings = selectedDate ? (bookingMap[selectedDate] || []) : []

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">Availability Calendar</h2>
          <button
            onClick={goToday}
            className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <span className="min-w-[140px] text-center text-sm font-semibold text-white">
            {MONTHS[month]} {year}
          </span>

          <button
            onClick={() => navigate(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-amber-400"></span> Pending
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Approved
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-rose-400"></span> Rejected
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full ring-2 ring-indigo-400 bg-transparent"></span> Today
        </div>
      </div>

      {/* Day Headers */}
      <div className="mt-4 grid grid-cols-7 border-b border-white/5 pb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.2 }}
          className="mt-1 grid grid-cols-7"
        >
          {cells.map((cell, i) => {
            const events = cell.dateStr ? (bookingMap[cell.dateStr] || []) : []
            const isToday = cell.dateStr === todayStr
            const isSelected = cell.dateStr === selectedDate

            return (
              <button
                key={i}
                onClick={() => cell.current && setSelectedDate(cell.dateStr === selectedDate ? null : cell.dateStr)}
                disabled={!cell.current}
                className={`
                  relative flex flex-col items-center gap-1 py-3 transition-all duration-200
                  ${!cell.current ? 'cursor-default text-slate-700' : 'cursor-pointer text-slate-300 hover:bg-white/5'}
                  ${isSelected ? 'bg-indigo-500/10 rounded-xl ring-1 ring-indigo-500/30' : ''}
                  ${isToday && !isSelected ? 'rounded-xl' : ''}
                `}
              >
                <span className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors
                  ${isToday ? 'ring-2 ring-indigo-400 text-indigo-300 font-bold' : ''}
                  ${isSelected ? 'bg-indigo-500 text-white ring-0' : ''}
                `}>
                  {cell.day}
                </span>

                {/* Booking dots */}
                {events.length > 0 && (
                  <div className="flex gap-0.5">
                    {events.slice(0, 3).map((ev, j) => (
                      <span key={j} className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[ev.status]}`}></span>
                    ))}
                    {events.length > 3 && (
                      <span className="text-[9px] text-slate-500 ml-0.5">+{events.length - 3}</span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Selected date detail panel */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="rounded-md p-1 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {selectedBookings.length === 0 ? (
                <p className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  All resources available — no bookings on this date.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {selectedBookings.map(b => (
                    <div key={b.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className={`h-2 w-2 rounded-full ${DOT_COLORS[b.status]}`}></span>
                        <div>
                          <p className="text-sm font-medium text-white">{b.resource}</p>
                          <p className="text-xs text-slate-400">by {b.user} — {b.id}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_BG[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BookingCalendar
