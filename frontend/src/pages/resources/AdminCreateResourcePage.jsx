import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import resourceService from '../../api/resourceService'

const AdminCreateResourcePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'LAB',
    capacity: '',
    location: '',
    status: 'ACTIVE',
    description: '',
    startTime: '08:00',
    endTime: '18:00'
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      fetchResource()
    }
  }, [id])

  const fetchResource = async () => {
    try {
      setFetching(true)
      const data = await resourceService.getResourceById(id)
      
      // Parse availabilityWindow (Expected format: "HH:mm-HH:mm")
      let start = '08:00'
      let end = '18:00'
      const window = data.availabilityWindow || data.availabilityWindows
      if (window && window.includes('-')) {
        const parts = window.split('-')
        start = parts[0]
        end = parts[1]
      }

      setFormData({
        ...data,
        capacity: data.capacity || '',
        startTime: start,
        endTime: end
      })
    } catch (err) {
      setError('Failed to load resource details.')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        availabilityWindows: `${formData.startTime}-${formData.endTime}`
      }

      if (isEdit) {
        await resourceService.updateResource(id, payload)
      } else {
        await resourceService.createResource(payload)
      }

      navigate('/dashboard/admin/resources')
    } catch (err) {
      setError(err.message || 'Failed to save resource. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <button
            onClick={() => navigate('/dashboard/admin/resources')}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Resources
          </button>
          <h1 className="text-3xl font-bold text-white">
            {isEdit ? 'Edit Resource' : 'Add New Resource'}
          </h1>
          <p className="mt-2 text-slate-400">
            {isEdit ? 'Update the details of this campus facility.' : 'Define a new room, lab, or equipment for the campus.'}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-medium text-rose-400"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-xl"
          >
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
              </div>
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">Resource Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Computer Lab A101"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white transition focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">Resource Identifier</label>
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. LAB-A101"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white transition focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-400">Resource Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white transition focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="LAB">Lab</option>
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="MEETING_ROOM">Meeting Room</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-400">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white transition focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Location & Availability Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-xl"
          >
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              Location & Timing
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Block A, Floor 1"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white transition focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">Availability Time Range</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white transition focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                  <span className="text-slate-500">to</span>
                  <div className="flex-1">
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white transition focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">Current Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white transition focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="ACTIVE">Active (Available for booking)</option>
                  <option value="OUT_OF_SERVICE">Out of Service (Maintenance)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Description Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-xl"
          >
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              Additional Details
            </h2>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-400">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe the resource, equipment included, or special instructions..."
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white transition focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <button
            type="submit"
            disabled={loading}
            className="group relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              )}
              {isEdit ? 'Update Resource' : 'Save Resource'}
            </span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/admin/resources')}
            className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
        </motion.div>
      </form>
    </div>
  )
}

export default AdminCreateResourcePage
