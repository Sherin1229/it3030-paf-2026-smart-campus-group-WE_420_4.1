import { useState, useMemo } from 'react'

const DOT_COLORS = {
  Pending:  'bg-amber-400',
  Approved: 'bg-emerald-400',
  Rejected: 'bg-rose-400',
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
]



const MiniBookingCalendar = ({ onDateSelect, selectedDate, selectedResource, resources = [], bookings = [] }) => {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [hoveredDate, setHoveredDate] = useState(null)

  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const navigate = (delta) => {
    setViewDate(new Date(year, month + delta, 1))
  }

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const prevDays = new Date(year, month, 0).getDate()

    const grid = []
    for (let i = firstDay - 1; i >= 0; i--) {
      grid.push({ day: prevDays - i, current: false, dateStr: null })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      grid.push({ day: d, current: true, dateStr })
    }
    const remaining = 42 - grid.length
    for (let d = 1; d <= remaining; d++) {
      grid.push({ day: d, current: false, dateStr: null })
    }
    return grid
  }, [year, month])

  const bookingMap = useMemo(() => {
    const map = {}
    bookings.forEach(b => {
      // Map backend fields to UI expected fields
      const uiBooking = {
        id: b.id,
        date: b.date,
        resource: b.resourceName,
        user: b.requesterEmail,
        status: b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase()
      }

      if (selectedResource && uiBooking.resource !== selectedResource) {
        return
      }
      if (!map[uiBooking.date]) map[uiBooking.date] = []
      map[uiBooking.date].push(uiBooking)
    })
    return map
  }, [bookings, selectedResource])

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const hoveredBookings = hoveredDate ? (bookingMap[hoveredDate] || []) : []
  const selectedDayBookings = selectedDate ? (bookingMap[selectedDate] || []) : []
  const selectedBookedResources = selectedDayBookings.map((booking) => booking.resource)
  const selectedFreeResources = resources.length
    ? resources.filter((resource) => !selectedBookedResources.includes(resource.name))
    : []
  const selectedDateLabel = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Availability
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(-1)}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="min-w-[80px] text-center text-[11px] font-semibold text-slate-300">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={() => navigate(1)}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="mt-3 grid grid-cols-7 gap-0">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold uppercase text-slate-600">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-1 grid grid-cols-7 gap-0">
        {cells.map((cell, i) => {
          const events = cell.dateStr ? (bookingMap[cell.dateStr] || []) : []
          const isToday = cell.dateStr === todayStr
          const hasBookings = events.length > 0
          const isPast = cell.dateStr && cell.dateStr < todayStr

          return (
            <button
              key={i}
              disabled={!cell.current}
              onClick={() => {
                if (cell.current && onDateSelect && !isPast) {
                  onDateSelect(cell.dateStr)
                }
              }}
              onMouseEnter={() => cell.current && setHoveredDate(cell.dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
              className={`
                relative flex flex-col items-center py-1.5 transition-all text-[11px] rounded-md
                ${!cell.current ? 'text-slate-800 cursor-default' : ''}
                ${cell.current && isPast ? 'text-slate-600 cursor-not-allowed' : ''}
                ${cell.current && !isPast ? 'text-slate-300 cursor-pointer hover:bg-white/10' : ''}
                ${isToday ? 'font-bold' : ''}
              `}
            >
              <span className={`
                flex h-6 w-6 items-center justify-center rounded-full text-[11px]
                ${isToday ? 'bg-sky-500 text-white font-bold' : ''}
              `}>
                {cell.day}
              </span>
              {hasBookings && (
                <div className="flex gap-px mt-0.5">
                  {events.slice(0, 3).map((ev, j) => (
                    <span key={j} className={`h-1 w-1 rounded-full ${DOT_COLORS[ev.status]}`}></span>
                  ))}
                </div>
              )}
              {cell.current && !isPast && !hasBookings && (
                <div className="h-1 w-1 mt-0.5 rounded-full bg-emerald-500/30"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 border-t border-white/5 pt-3">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Booked
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span> Pending
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/30"></span> Free
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-white/5 bg-slate-950/40 px-3 py-2 text-[11px] text-slate-400">
        <p className="font-medium text-slate-300">
          {selectedDateLabel || 'Tap a free day to autofill the booking date.'}
        </p>
        {selectedDate ? (
          <div className="mt-2 space-y-1.5">
            <p>
              {selectedDayBookings.length > 0
                ? `${selectedDayBookings.length} resource${selectedDayBookings.length === 1 ? '' : 's'} already booked, ${selectedFreeResources.length} still free.`
                : 'All resources are currently free on this day.'}
            </p>
            {selectedBookedResources.length > 0 && (
              <p className="text-slate-300">
                Booked: {selectedBookedResources.join(', ')}
              </p>
            )}
            {selectedFreeResources.length > 0 && (
              <p className="text-emerald-300">
                Free: {selectedFreeResources.map((resource) => resource.name).join(', ')}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-1">Free days show as a green dot. Hover or tap to inspect availability.</p>
        )}
      </div>

      {/* Hover details */}
      <div className="mt-2 min-h-20 rounded-lg border border-white/5 bg-black/40 p-2.5 text-[11px]">
        {hoveredDate && hoveredBookings.length > 0 ? (
          <>
            <p className="mb-1.5 font-semibold text-slate-300">
              {new Date(`${hoveredDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            {hoveredBookings.map((b, i) => (
              <div key={i} className="flex items-center gap-2 py-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[b.status]}`}></span>
                <span className="text-slate-400">{b.resource}</span>
              </div>
            ))}
          </>
        ) : (
          <p className="text-slate-500">Hover a booked day to preview the occupied resources.</p>
        )}
      </div>
    </div>
  )
}

export default MiniBookingCalendar
