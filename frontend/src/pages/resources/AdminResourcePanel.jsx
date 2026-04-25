import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import resourceService from '../../api/resourceService'

const AdminResourcePanel = () => {
  const navigate = useNavigate()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [successMsg, setSuccessMsg] = useState('')

  const getResourceIcon = (type) => {
    switch (type) {
      case 'LAB':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 2v7.31"/><path d="M6 20.82l1.79-6.82h8.42l1.79 6.82A2 2 0 0 1 16.07 23H7.93a2 2 0 0 1-1.93-2.18z"/></svg>
        )
      case 'LECTURE_HALL':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        )
      case 'MEETING_ROOM':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        )
      case 'AUDITORIUM':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 13a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M2 17h20"/><path d="M2 21h20"/></svg>
        )
      case 'PLAYGROUND':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M7 22v-5"/><path d="M12 22v-8"/><path d="M17 22v-3"/></svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        )
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const data = await resourceService.getAllResources()
      setResources(data)
    } catch (err) {
      console.error('Failed to fetch resources:', err)
      setResources([])
    } finally {
      setLoading(false)
    }
  }

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return
    try {
      await resourceService.deleteResource(id)
      await fetchResources()
      showSuccess('Resource deleted successfully')
    } catch (err) {
      alert('Failed to delete resource.')
    }
  }

  const handleStatusToggle = async (resource) => {
    try {
      const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE'
      await resourceService.updateStatus(resource.id, newStatus)
      await fetchResources()
      showSuccess(`Status updated to ${newStatus}`)
    } catch (err) {
      alert('Failed to update status.')
    }
  }

  const filtered = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchText.toLowerCase()) ||
      r.location.toLowerCase().includes(searchText.toLowerCase())
    
    if (activeTab === 'all') return matchesSearch
    return matchesSearch && r.type === activeTab
  })

  const stats = {
    total: resources.length,
    active: resources.filter((r) => r.status === 'ACTIVE').length,
    outOfService: resources.filter((r) => r.status === 'OUT_OF_SERVICE').length,
    labs: resources.filter((r) => r.type === 'LAB').length
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-8">
      {/* Success Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-50 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-emerald-400 backdrop-blur-xl shadow-2xl shadow-emerald-500/20"
          >
            <div className="flex items-center gap-3 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {successMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Resource Management</h1>
          <p className="mt-1 text-slate-400">Manage campus facilities, laboratories, and equipment.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/admin/resources/create')}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Resource
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total Resources', value: stats.total, color: 'emerald', icon: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7' },
          { label: 'Active Facilities', value: stats.active, color: 'sky', icon: 'M12 22s8-6 8-12a8 8 0 0 0-16 0c0 6 8 12 8 12z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
          { label: 'Under Maintenance', value: stats.outOfService, color: 'rose', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
          { label: 'Total Laboratories', value: stats.labs, color: 'purple', icon: 'M10 2v7.31 M14 2v7.31 M6 20.82l1.79-6.82h8.42l1.79 6.82A2 2 0 0 1 16.07 23H7.93a2 2 0 0 1-1.93-2.18z' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-white/10 hover:bg-slate-900/60"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon}/></svg>
            </div>
            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/5 bg-slate-900/20 p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'LAB', 'LECTURE_HALL', 'MEETING_ROOM', 'ROOM', 'AUDITORIUM', 'PLAYGROUND'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Resources' : tab.replace(/_/g, ' ').charAt(0) + tab.replace(/_/g, ' ').slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500/50 lg:w-72"
          />
        </div>
      </div>

      {/* Resource Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Availability</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                    <p className="mt-3 text-slate-400">Loading resources...</p>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((resource) => (
                  <tr key={resource.id} className="group transition hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:shadow-lg group-hover:shadow-emerald-500/20`}>
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white group-hover:text-emerald-300 transition-colors">{resource.name}</p>
                            <span className="inline-flex rounded bg-slate-800 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400">
                              {resource.type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{resource.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                        {resource.capacity ? `${resource.capacity} Seats` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-300">{resource.availabilityWindow || 'Always Open'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusToggle(resource)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold transition-all ${
                          resource.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20'
                        }`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${resource.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
                        {resource.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => navigate(`/dashboard/admin/resources/edit/${resource.id}`)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-400"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <svg className="mx-auto mb-3 text-slate-600" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>
                    No resources found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  )
}

export default AdminResourcePanel