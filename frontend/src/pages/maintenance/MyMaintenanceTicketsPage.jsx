import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TicketList from '../../components/maintenance/TicketList'
import TicketDetail from '../../components/maintenance/TicketDetail'
import { Plus, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const MyMaintenanceTicketsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
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
      const emailQuery = user?.email ? `?email=${encodeURIComponent(user.email)}` : ''
      const response = await fetch(`${apiUrl}/maintenance/tickets/my${emailQuery}`, {
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

  return (
    <div className="py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Maintenance Tickets</h1>
          <p className="text-gray-400">Track and manage your reported issues</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/user/maintenance/create')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          Report Issue
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* Content */}
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
          onUpdateStatus={async (ticketId, status, reason) => {
            // User can view but cannot update their own tickets
            alert('Only staff can update ticket status')
          }}
          onAddNote={async (ticketId, note) => {
            // User can add notes to their tickets
          }}
          userRole="USER"
        />
      )}
    </div>
  )
}

export default MyMaintenanceTicketsPage
