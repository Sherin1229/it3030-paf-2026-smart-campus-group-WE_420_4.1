import { useState, useEffect } from 'react'
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout'
import TicketList from '../../components/maintenance/TicketList'
import TicketDetail from '../../components/maintenance/TicketDetail'
import { AlertCircle, RefreshCw } from 'lucide-react'

const AdminMaintenanceTicketsPage = () => {
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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
      setTickets(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load tickets')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (ticketId, newStatus, rejectionReason) => {
    try {
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

      // Update local state
      setTickets(tickets.map(ticket =>
        ticket.ticketId === ticketId
          ? { ...ticket, status: newStatus, rejectionReason }
          : ticket
      ))
      setSelectedTicket(prev => prev && prev.ticketId === ticketId ? { ...prev, status: newStatus } : prev)
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
    <AdminDashboardLayout>
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-red-300">{error}</span>
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
    </AdminDashboardLayout>
  )
}

export default AdminMaintenanceTicketsPage
