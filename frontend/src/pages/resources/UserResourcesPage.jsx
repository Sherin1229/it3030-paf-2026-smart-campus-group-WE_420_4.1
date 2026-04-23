import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import resourceService from '../../api/resourceService'

const UserResourcesPage = () => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState(null)
  const [activeType, setActiveType] = useState('ALL')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const data = await resourceService.getAllResources()
      setResources(data)
    } catch (err) {
      console.error('Error fetching resources:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchText.toLowerCase()) ||
      r.location.toLowerCase().includes(searchText.toLowerCase())
    const matchesType = activeType === 'ALL' || r.type === activeType
    return matchesSearch && matchesType
  })

  const ResourceIcon = ({ type }) => {
    switch (type) {
      case 'LAB': return '🔬'
      case 'LECTURE_HALL': return '🏛️'
      case 'MEETING_ROOM': return '🤝'
      case 'EQUIPMENT': return '🎥'
      default: return '📦'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Available Resources</h1>
          <p className="mt-1 text-slate-400">Discover and book campus facilities for your academic needs.</p>
        </div>
        
        <div className="relative group">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 md:w-80"
          />
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['ALL', 'LAB', 'LECTURE_HALL', 'MEETING_ROOM', 'EQUIPMENT'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              activeType === type
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-900/40 text-slate-400 border border-white/5 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            {type === 'ALL' ? 'All Resources' : type.replace(/_/g, ' ').charAt(0) + type.replace(/_/g, ' ').slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-slate-400 animate-pulse">Gathering campus resources...</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filtered.map((resource) => (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedResource(resource)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-indigo-500/30 hover:bg-slate-900/60"
              >
                {/* Accent Glow */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl shadow-inner transition group-hover:bg-indigo-500/20">
                    <ResourceIcon type={resource.type} />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ring-1 ring-inset ${
                    resource.status === 'ACTIVE' 
                      ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
                  }`}>
                    {resource.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="relative z-10 mt-6">
                  <h3 className="text-lg font-bold text-white transition group-hover:text-indigo-300">
                    {resource.name}
                  </h3>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      {resource.location}
                    </div>
                    {resource.capacity && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        {resource.capacity} Seats
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-semibold text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="py-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-900/40 text-4xl border border-white/5">🔍</div>
          <h3 className="mt-4 text-xl font-bold text-white">No resources found</h3>
          <p className="mt-2 text-slate-400">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResource(null)}
              className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] z-[70] mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl md:top-[15%]"
            >
              <div className="relative h-32 w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                <button
                  onClick={() => setSelectedResource(null)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <div className="absolute -bottom-10 left-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-4xl shadow-xl border border-white/10">
                  <ResourceIcon type={selectedResource.type} />
                </div>
              </div>

              <div className="p-8 pt-14">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedResource.name}</h2>
                    <p className="text-indigo-400 font-medium">{selectedResource.type.replace(/_/g, ' ')}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${
                    selectedResource.status === 'ACTIVE' 
                      ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
                  }`}>
                    {selectedResource.status}
                  </span>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Location</p>
                      <p className="mt-1 flex items-center gap-2 text-white font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {selectedResource.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Capacity</p>
                      <p className="mt-1 flex items-center gap-2 text-white font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        {selectedResource.capacity || 'N/A'} Persons
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Availability</p>
                      <p className="mt-1 flex items-center gap-2 text-white font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        {selectedResource.availabilityWindows || 'Always Available'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resource ID</p>
                      <p className="mt-1 font-mono text-xs text-slate-400">#{selectedResource.id}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/5 pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {selectedResource.description || 'No detailed description available for this facility.'}
                  </p>
                </div>

                <div className="mt-10 flex gap-4">
                  <button
                    disabled={selectedResource.status !== 'ACTIVE'}
                    className="flex-1 rounded-xl bg-indigo-500 py-3 text-sm font-bold text-white transition hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                    onClick={() => {
                      // Navigate to booking creation with this resource pre-selected
                      window.location.href = `/dashboard/user/bookings/create?resource=${selectedResource.id}`;
                    }}
                  >
                    Book This Facility
                  </button>
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserResourcesPage
