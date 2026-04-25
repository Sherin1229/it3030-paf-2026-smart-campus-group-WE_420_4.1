import { useState, useEffect, useMemo } from 'react'
import TicketList from '../../components/maintenance/TicketList'
import TicketDetail from '../../components/maintenance/TicketDetail'
import { AlertCircle, RefreshCw, Clock3, TimerReset } from 'lucide-react'

const normalizeTicket = (ticket) => ({
  ...ticket,
  ticketId: ticket?.ticketId ?? ticket?.id,
})

const parseDate = (value) => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const getDurationMs = (start, end) => {
  const startDate = parseDate(start)
  const endDate = parseDate(end)

  if (!startDate || !endDate) return null

  const duration = endDate.getTime() - startDate.getTime()
  return duration > 0 ? duration : null
}

const getFirstResponseMs = (ticket) => {
  const createdAt = ticket?.createdAt
  const noteTimes = (ticket?.notes || [])
    .map((note) => parseDate(note.createdAt))
    .filter(Boolean)
    .sort((a, b) => a.getTime() - b.getTime())

  if (noteTimes.length > 0) {
    return getDurationMs(createdAt, noteTimes[0].toISOString())
  }

  if (ticket?.status !== 'OPEN' && ticket?.updatedAt && ticket.updatedAt !== ticket.createdAt) {
    return getDurationMs(createdAt, ticket.updatedAt)
  }

  return null
}

const getResolutionMs = (ticket) => {
  if (!['RESOLVED', 'CLOSED'].includes(ticket?.status)) {
    return null
  }

  return getDurationMs(ticket.createdAt, ticket.updatedAt)
}

const averageDuration = (durations) => {
  if (!durations.length) return null
  return durations.reduce((sum, value) => sum + value, 0) / durations.length
}

const formatDuration = (durationMs) => {
  if (durationMs === null || durationMs === undefined) return 'N/A'

  const totalMinutes = Math.round(durationMs / 60000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) {
    return `${days}d ${hours}h`
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}

const AdminMaintenanceTicketsPage = () => {
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('')

  const serviceMetrics = useMemo(() => {
    const firstResponseDurations = tickets
      .map(getFirstResponseMs)
      .filter((value) => value !== null)

    const resolutionDurations = tickets
      .map(getResolutionMs)
      .filter((value) => value !== null)

    const breachedFirstResponseCount = firstResponseDurations.filter((value) => value > 4 * 60 * 60 * 1000).length
    const breachedResolutionCount = resolutionDurations.filter((value) => value > 48 * 60 * 60 * 1000).length

    return {
      averageFirstResponse: averageDuration(firstResponseDurations),
      averageResolution: averageDuration(resolutionDurations),
      firstResponseCoverage: firstResponseDurations.length,
      resolutionCoverage: resolutionDurations.length,
      breachedFirstResponseCount,
      breachedResolutionCount,
    }
  }, [tickets])

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    setIsLoading(true)
    setError('')

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
      const response = await fetch(`${apiUrl}/maintenance/tickets/all`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tickets')
      }

      const data = await response.json()
      setTickets(Array.isArray(data) ? data.map(normalizeTicket) : [])
    } catch (err) {
      setError(err.message || 'Failed to load tickets')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (ticketId, newStatus, rejectionReason) => {
    try {
      setStatusUpdateMessage('')
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
      const payload = {
        status: newStatus,
        ...(rejectionReason && { rejectionReason })
      }

      const response = await fetch(`${apiUrl}/maintenance/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to update ticket status')
      }

      const updatedTicket = normalizeTicket(await response.json())

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.ticketId === ticketId ? updatedTicket : ticket
        )
      )
      setSelectedTicket((prev) =>
        prev && prev.ticketId === ticketId ? updatedTicket : prev
      )
      setStatusUpdateMessage(`Ticket #${ticketId} updated to ${newStatus.replace('_', ' ')}.`)
      await fetchTickets()
      setSelectedTicket(updatedTicket)
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update ticket status')
    }
  }

  const handleAddNote = async (ticketId, noteContent) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
      const response = await fetch(`${apiUrl}/maintenance/tickets/${ticketId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteContent }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to add note')
      }

      const newNote = await response.json()
      setTickets(tickets.map(ticket =>
        ticket.ticketId === ticketId
          ? { ...ticket, notes: [...(ticket.notes || []), newNote] }
          : ticket
      ))
      setSelectedTicket(prev =>
        prev && prev.ticketId === ticketId
          ? { ...prev, notes: [...(prev.notes || []), newNote] }
          : prev
      )
    } catch (err) {
      console.error('Error adding note:', err)
      alert('Failed to add note')
    }
  }

  return (
    <div className="py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Maintenance Tickets Management</h1>
          <p className="text-gray-400">Manage all maintenance tickets across campus</p>
        </div>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
        >
          <RefreshCw className="h-5 w-5" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total', count: tickets.length, color: 'from-blue-500 to-blue-600' },
          { label: 'Open', count: tickets.filter(t => t.status === 'OPEN').length, color: 'from-emerald-500 to-emerald-600' },
          { label: 'In Progress', count: tickets.filter(t => t.status === 'IN_PROGRESS').length, color: 'from-yellow-500 to-yellow-600' },
          { label: 'Resolved', count: tickets.filter(t => t.status === 'RESOLVED').length, color: 'from-purple-500 to-purple-600' },
          { label: 'Closed', count: tickets.filter(t => t.status === 'CLOSED').length, color: 'from-gray-500 to-gray-600' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white`}
          >
            <p className="text-sm opacity-90">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-200/80">Service-Level Timer</p>
              <h2 className="text-2xl font-bold mt-1">Time to First Response</h2>
            </div>
            <Clock3 className="h-6 w-6 text-cyan-200" />
          </div>
          <p className="mt-6 text-4xl font-bold">{formatDuration(serviceMetrics.averageFirstResponse)}</p>
          <p className="mt-2 text-sm text-cyan-100/80">
            Based on {serviceMetrics.firstResponseCoverage} ticket(s) with a recorded first response.
          </p>
          <p className="mt-4 text-sm text-cyan-100/90">
            {serviceMetrics.breachedFirstResponseCount} ticket(s) exceeded the 4-hour first response target.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-amber-200/80">Service-Level Timer</p>
              <h2 className="text-2xl font-bold mt-1">Time to Resolution</h2>
            </div>
            <TimerReset className="h-6 w-6 text-amber-200" />
          </div>
          <p className="mt-6 text-4xl font-bold">{formatDuration(serviceMetrics.averageResolution)}</p>
          <p className="mt-2 text-sm text-amber-100/80">
            Based on {serviceMetrics.resolutionCoverage} resolved or closed ticket(s).
          </p>
          <p className="mt-4 text-sm text-amber-100/90">
            {serviceMetrics.breachedResolutionCount} ticket(s) exceeded the 48-hour resolution target.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {statusUpdateMessage && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-200">
          {statusUpdateMessage}
        </div>
      )}

      {/* Tickets List */}
      <div className="max-w-4xl mx-auto">
        <TicketList
          tickets={tickets}
          onSelectTicket={setSelectedTicket}
          isLoading={isLoading}
          showFilters={true}
        />
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddNote={handleAddNote}
          isLoading={false}
          userRole="ADMIN"
        />
      )}
    </div>
  )
}

export default AdminMaintenanceTicketsPage
