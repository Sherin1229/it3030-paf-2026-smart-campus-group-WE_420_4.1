import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ChevronRight } from 'lucide-react'

const PRIORITY_COLORS = {
  Low: 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-300 ring-1 ring-yellow-500/20',
  High: 'bg-orange-500/10 text-orange-300 ring-1 ring-orange-500/20',
  Critical: 'bg-red-500/10 text-red-300 ring-1 ring-red-500/20',
}

const STATUS_COLORS = {
  OPEN: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20',
  RESOLVED: 'bg-purple-500/10 text-purple-300 ring-1 ring-purple-500/20',
  CLOSED: 'bg-gray-500/10 text-gray-300 ring-1 ring-gray-500/20',
  REJECTED: 'bg-red-500/10 text-red-300 ring-1 ring-red-500/20',
}

const TicketList = ({ tickets = [], onSelectTicket, isLoading, showFilters = true }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedPriority, setSelectedPriority] = useState('ALL')
  const [sortBy, setSortBy] = useState('created')

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets.filter(ticket => {
      const matchesSearch = 
        ticket.resourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.resourceLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketId?.toString().includes(searchTerm)

      const matchesStatus = selectedStatus === 'ALL' || ticket.status === selectedStatus
      const matchesPriority = selectedPriority === 'ALL' || ticket.priority === selectedPriority

      return matchesSearch && matchesStatus && matchesPriority
    })

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'created') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      } else if (sortBy === 'priority') {
        const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return 0
    })

    return filtered
  }, [tickets, searchTerm, selectedStatus, selectedPriority, sortBy])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No tickets found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by ID, resource, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="created">Recently Created</option>
                <option value="priority">By Priority</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <p className="text-sm text-gray-400">Showing {filteredAndSortedTickets.length} ticket(s)</p>

      {/* Tickets List */}
      <AnimatePresence>
        <div className="space-y-3">
          {filteredAndSortedTickets.map((ticket, index) => (
            <motion.button
              key={ticket.ticketId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectTicket?.(ticket)}
              className="w-full text-left group"
            >
              <div className="bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 group-hover:border-white/20 rounded-lg p-4 transition-all duration-300 transform group-hover:scale-102">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-gray-500">#{ticket.ticketId}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[ticket.status]}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{ticket.resourceName}</h3>
                    <p className="text-sm text-gray-400 mb-2">{ticket.resourceLocation}</p>
                    <p className="text-sm text-gray-300 line-clamp-2">{ticket.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition ml-4 self-center" />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()} • {ticket.categoryAssigned || ticket.category}
                  </p>
                  {ticket.assignedTo && (
                    <p className="text-xs text-blue-400">Assigned to: {ticket.assignedTo}</p>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}

export default TicketList
