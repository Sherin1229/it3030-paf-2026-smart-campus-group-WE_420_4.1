import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, MessageSquare, CheckCircle } from 'lucide-react'

const STATUS_COLORS = {
  OPEN: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20',
  RESOLVED: 'bg-purple-500/10 text-purple-300 ring-1 ring-purple-500/20',
  CLOSED: 'bg-gray-500/10 text-gray-300 ring-1 ring-gray-500/20',
  REJECTED: 'bg-red-500/10 text-red-300 ring-1 ring-red-500/20',
}

const PRIORITY_COLORS = {
  Low: 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-300 ring-1 ring-yellow-500/20',
  High: 'bg-orange-500/10 text-orange-300 ring-1 ring-orange-500/20',
  Critical: 'bg-red-500/10 text-red-300 ring-1 ring-red-500/20',
}

const TicketDetail = ({ ticket, onClose, onUpdateStatus, onAddNote, isLoading, userRole = 'USER' }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [newNote, setNewNote] = useState('')
  const [newStatus, setNewStatus] = useState(ticket?.status || 'OPEN')
  const [rejectionReason, setRejectionReason] = useState('')

  const canUpdateStatus = ['ADMIN', 'STAFF'].includes(userRole)
  const availableStatuses = userRole === 'ADMIN' 
    ? ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']
    : ['IN_PROGRESS', 'RESOLVED']

  useEffect(() => {
    setNewStatus(ticket?.status || 'OPEN')
    setRejectionReason(ticket?.rejectionReason || '')
  }, [ticket])

  const handleStatusUpdate = async () => {
    if (newStatus === 'REJECTED' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    await onUpdateStatus(ticket.ticketId, newStatus, newStatus === 'REJECTED' ? rejectionReason : '')
  }

  const handleAddNote = async () => {
    if (newNote.trim()) {
      await onAddNote(ticket.ticketId, newNote)
      setNewNote('')
    }
  }

  if (!ticket) return null

  const images = ticket.imageUrls || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/5 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Ticket #{ticket.ticketId}</p>
            <h2 className="text-2xl font-bold text-white">{ticket.resourceName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">Status</p>
              {canUpdateStatus ? (
                <div className="space-y-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                  >
                    {availableStatuses.map((status) => (
                      <option key={status} value={status} className="bg-slate-900 text-white">
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>

                  {newStatus !== ticket.status ? (
                    <div className="rounded-lg border border-white/20 bg-white/5 p-4 space-y-3">
                      {newStatus === 'REJECTED' ? (
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Please provide a reason for rejection..."
                          rows="2"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition resize-none text-sm"
                        />
                      ) : null}
                      <button
                        onClick={handleStatusUpdate}
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Update Status to {newStatus.replace('_', ' ')}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${STATUS_COLORS[ticket.status]}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">Priority</p>
              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${PRIORITY_COLORS[ticket.priority]}`}>
                {ticket.priority}
              </span>
            </div>
          </div>

          {/* Resource Information */}
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-white">Resource Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Location</p>
                <p className="text-white">{ticket.resourceLocation}</p>
              </div>
              <div>
                <p className="text-gray-400">Category</p>
                <p className="text-white">{ticket.category}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-white">Issue Description</h3>
            <p className="text-gray-300">{ticket.description}</p>
          </div>

          {/* Contact Information */}
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-white">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Name</p>
                <p className="text-white">{ticket.contactName}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="text-white">{ticket.contactEmail}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone</p>
                <p className="text-white">{ticket.contactPhone}</p>
              </div>
              {ticket.assignedTo && (
                <div>
                  <p className="text-gray-400">Assigned To</p>
                  <p className="text-white">{ticket.assignedTo}</p>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          {images.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Evidence Photos</h3>
              <div className="space-y-3">
                <div className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
                  <img
                    src={images[selectedImage]}
                    alt={`Evidence ${selectedImage + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          selectedImage === idx ? 'border-blue-500' : 'border-white/10'
                        } hover:border-blue-500 transition`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notes ({ticket.notes?.length || 0})
            </h3>
            
            <div className="bg-white/5 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
              {ticket.notes && ticket.notes.length > 0 ? (
                ticket.notes.map((note, idx) => (
                  <div key={idx} className="bg-white/5 p-3 rounded border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm text-white">{note.author}</p>
                      <p className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-gray-300">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No notes yet</p>
              )}
            </div>

            {/* Add Note */}
            {userRole === 'ADMIN' || userRole === 'STAFF' ? (
              <div className="space-y-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a resolution note..."
                  rows="3"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition resize-none text-sm"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
                >
                  Add Note
                </button>
              </div>
            ) : null}
          </div>

          {/* Dates */}
          <div className="text-xs text-gray-500 space-y-1 border-t border-white/10 pt-4">
            <p>Created: {new Date(ticket.createdAt).toLocaleString()}</p>
            {ticket.updatedAt && <p>Updated: {new Date(ticket.updatedAt).toLocaleString()}</p>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TicketDetail
