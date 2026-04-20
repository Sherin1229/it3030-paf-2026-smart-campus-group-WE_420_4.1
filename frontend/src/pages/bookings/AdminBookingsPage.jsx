import { useState } from 'react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import BookingCalendar from '../../components/bookings/BookingCalendar'

const STATUS_COLORS = {
  Pending:  { bg: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',  dot: 'bg-amber-400' },
  Approved: { bg: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20', dot: 'bg-emerald-400' },
  Rejected: { bg: 'bg-rose-500/10 text-rose-300 ring-rose-500/20', dot: 'bg-rose-400' },
}

const initialBookings = [
  { id: 'REQ-001', user: 'John Doe',    resource: 'Lab A',     date: '2026-04-25', status: 'Pending'  },
  { id: 'REQ-002', user: 'Jane Smith',  resource: 'Main Hall', date: '2026-04-26', status: 'Pending'  },
  { id: 'REQ-003', user: 'Ali Hassan',  resource: 'Lab B',     date: '2026-04-20', status: 'Approved' },
  { id: 'REQ-004', user: 'Sara Khan',   resource: 'Auditorium',date: '2026-04-18', status: 'Rejected' },
]

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter]   = useState('All')
  const [exporting, setExporting] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'calendar'

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter)

  const updateStatus = (id, status) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))

  const exportPdf = () => {
    setExporting(true)
    const doc = new jsPDF()

    // Header
    doc.setFillColor(15, 23, 42)          // slate-900
    doc.rect(0, 0, 210, 32, 'F')
    doc.setTextColor(52, 211, 153)         // emerald-400
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('SMART CAMPUS HUB', 14, 12)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.text('Booking Management Report', 14, 23)

    // Meta info
    doc.setTextColor(100, 116, 139)       // slate-500
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38)
    doc.text(`Filter: ${filter}   Total Records: ${filtered.length}`, 14, 44)

    // Status summary chips
    const counts = { Pending: 0, Approved: 0, Rejected: 0 }
    bookings.forEach(b => counts[b.status]++)
    doc.setFontSize(9)
    doc.setTextColor(251, 191, 36);  doc.text(`Pending: ${counts.Pending}`,   14, 52)
    doc.setTextColor(52, 211, 153);  doc.text(`Approved: ${counts.Approved}`, 55, 52)
    doc.setTextColor(248, 113, 113); doc.text(`Rejected: ${counts.Rejected}`, 100, 52)

    // Table
    autoTable(doc, {
      startY: 58,
      head: [['Request ID', 'User', 'Resource', 'Date', 'Status']],
      body: filtered.map(b => [b.id, b.user, b.resource, b.date, b.status]),
      styles: {
        fontSize: 10,
        cellPadding: 5,
        font: 'helvetica',
        textColor: [30, 41, 59],
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [148, 163, 184],
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: 6,
      },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      columnStyles: {
        0: { fontStyle: 'bold' },
        4: {
          fontStyle: 'bold',
          textColor: (data) => {
            const s = data.cell.raw
            return s === 'Approved' ? [52, 211, 153] : s === 'Rejected' ? [248, 113, 113] : [251, 191, 36]
          },
        },
      },
      didParseCell: (data) => {
        if (data.column.index === 4 && data.section === 'body') {
          const s = data.cell.raw
          data.cell.styles.textColor =
            s === 'Approved' ? [16, 185, 129] :
            s === 'Rejected' ? [239, 68, 68]  : [245, 158, 11]
        }
      },
    })

    // Footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      doc.text(
        `Smart Campus Hub — Confidential   |   Page ${i} of ${pageCount}`,
        14, doc.internal.pageSize.height - 8
      )
    }

    doc.save(`bookings-report-${Date.now()}.pdf`)
    setExporting(false)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Operations
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Manage Bookings</h1>
          <p className="mt-2 text-slate-300">Review, approve, or reject booking requests across the campus.</p>
        </div>

        {/* Export PDF Button */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex rounded-lg bg-white/5 p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
              Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              Calendar
            </button>
          </div>

          <button
            onClick={exportPdf}
            disabled={exporting || filtered.length === 0}
            className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? (
              <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            )}
            {exporting ? 'Generating…' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="mt-6">
          <BookingCalendar bookings={bookings} />
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
      <>
      {/* Filter Tabs */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              filter === tab
                ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
          >
            {tab}
            <span className="ml-2 opacity-60">
              {tab === 'All' ? bookings.length : bookings.filter(b => b.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-lg font-semibold text-white">
            {filter === 'All' ? 'All Requests' : `${filter} Requests`}
          </h2>
          {filter === 'Pending' && (
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-300">
              {filtered.length} Need Action
            </span>
          )}
        </div>

        <div className="mt-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-200">All caught up!</h3>
              <p className="mt-1 max-w-sm text-xs text-slate-400">No {filter.toLowerCase()} requests right now.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/50 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Request ID</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Resource</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => {
                    const color = STATUS_COLORS[req.status]
                    return (
                      <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 font-medium text-white">{req.id}</td>
                        <td className="px-4 py-4">{req.user}</td>
                        <td className="px-4 py-4">{req.resource}</td>
                        <td className="px-4 py-4">{req.date}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${color.bg}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`}></span>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {req.status === 'Pending' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => updateStatus(req.id, 'Approved')}
                                className="rounded bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateStatus(req.id, 'Rejected')}
                                className="rounded bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 italic">Resolved</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </motion.section>
  )
}

export default AdminBookingsPage
