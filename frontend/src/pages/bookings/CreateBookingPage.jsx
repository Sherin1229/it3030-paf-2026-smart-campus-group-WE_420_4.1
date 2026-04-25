import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MiniBookingCalendar from '../../components/bookings/MiniBookingCalendar'
import { useAuth } from '../../context/AuthContext'

const BOOKING_API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://10.50.20.47:8081/api'}/bookings`
const RESOURCE_API_BASE_URL = `${import.meta.env.VITE_API_V1_BASE_URL || 'http://172.28.11.53:8081/api/v1'}/resources`

const CreateBookingPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const editingBooking = location.state?.booking || null

  const [resources, setResources] = useState([])
  const [resourcesLoading, setResourcesLoading] = useState(true)
  const [resourcesError, setResourcesError] = useState('')

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch(`${RESOURCE_API_BASE_URL}?status=ACTIVE`)
        if (!res.ok) throw new Error('Failed to load resources.')
        const data = await res.json()
        setResources(data)
      } catch (err) {
        setResourcesError(err.message || 'Could not load resources.')
      } finally {
        setResourcesLoading(false)
      }
    }
    fetchResources()
  }, [])

  const [formData, setFormData] = useState({
    resourceType: editingBooking ? resources.find((resource) => resource.name === editingBooking.resource)?.type || '' : '',
    resourceId: editingBooking ? resources.find((resource) => resource.name === editingBooking.resource)?.id || '' : '',
    date: editingBooking?.date || '',
    startTime: editingBooking?.startTime || '',
    endTime: editingBooking?.endTime || '',
    purpose: editingBooking?.purpose || '',
    attendees: editingBooking?.attendees || '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date) => {
    setFormData((prev) => ({ ...prev, date }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const selectedResource = resources.find((resource) => String(resource.id) === formData.resourceId)
    if (!selectedResource) {
      setSubmitError('Please select a valid resource.')
      return
    }

    if (!user?.email) {
      setSubmitError('Unable to identify the logged-in user. Please login again.')
      return
    }

    setIsSubmitting(true)

    const payload = {
      requesterEmail: user.email,
      resourceId: selectedResource.id,
      resourceName: selectedResource.name,
      resourceType: selectedResource.type,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose,
      attendees: formData.attendees ? Number(formData.attendees) : null,
    }

    try {
      const response = await fetch(BOOKING_API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const responseBody = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(responseBody?.message || 'Failed to submit booking request.')
      }

      console.log('Booking Data Submitted:', responseBody)
      setIsSubmitting(false)
      alert(editingBooking ? 'Booking changes submitted as a new pending request.' : 'Booking request submitted successfully! Status: PENDING')
      navigate('/dashboard/user/bookings/my')
    } catch (error) {
      setIsSubmitting(false)
      setSubmitError(error.message || 'Failed to submit booking request.')
    }
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <p className="inline-flex w-fit rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
          Booking Management
        </p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {editingBooking ? 'Edit Booking Request' : 'Request New Booking'}
        </h1>
        <p className="max-w-2xl text-slate-300">
          {editingBooking
            ? 'Update the pending request before administration reviews it.'
            : 'Reserve campus facilities or equipment. Your request will be reviewed by the administration.'}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                Reservation Details
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Resource Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="resourceId">
                    Select Resource
                  </label>
                  {resourcesLoading ? (
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-slate-400">
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading resources...
                    </div>
                  ) : resourcesError ? (
                    <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                      {resourcesError}
                    </div>
                  ) : (
                    <select
                      id="resourceId"
                      name="resourceId"
                      required
                      value={formData.resourceId}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all appearance-none"
                    >
                      <option value="" disabled>Choose a hall, lab or equipment</option>
                      {resources.length === 0 ? (
                        <option value="" disabled>No resources available</option>
                      ) : (
                        resources.map(res => (
                          <option key={res.id} value={res.id}>{res.name} ({res.type})</option>
                        ))
                      )}
                    </select>
                  )}
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="date">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="startTime">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="endTime">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Additional Information
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="purpose">
                    Purpose of Booking
                  </label>
                  <textarea
                    id="purpose"
                    name="purpose"
                    required
                    rows="3"
                    placeholder="e.g. Guest lecture on Quantum Computing, Project team meeting..."
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="attendees">
                    Expected Attendees
                  </label>
                  <input
                    type="number"
                    id="attendees"
                    name="attendees"
                    min="1"
                    placeholder="Approximate count"
                    value={formData.attendees}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {submitError ? (
                <p className="w-full rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300">
                  {submitError}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex flex-1 items-center justify-center rounded-xl bg-sky-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-sky-900/40 transition hover:bg-sky-400 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  editingBooking ? 'Update Booking Request' : 'Submit Booking Request'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/user')}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-400/20 bg-sky-500/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white">Booking Summary</h3>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-sm text-slate-400">Resource</span>
                <span className="text-sm font-medium text-sky-300">
                  {resources.find(r => String(r.id) === formData.resourceId)?.name || 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-sm text-slate-400">Date</span>
                <span className="text-sm font-medium text-white">{formData.date || '---'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-sm text-slate-400">Time Window</span>
                <span className="text-sm font-medium text-white">
                  {formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : '---'}
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-3 rounded-xl bg-sky-500/10 p-3 text-xs text-sky-200 border border-sky-400/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
              <span>Your request will be marked as PENDING until an administrator reviews it.</span>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-base font-semibold text-white italic">Campus Rules</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex gap-2">
                <span className="text-sky-400 font-bold">•</span>
                Bookings can be made for immediate use if available.
              </li>
              <li className="flex gap-2">
                <span className="text-sky-400 font-bold">•</span>
                Max duration for lab sessions is 4 hours.
              </li>
              <li className="flex gap-2">
                <span className="text-sky-400 font-bold">•</span>
                Ensure all equipment is returned in its original condition.
              </li>
            </ul>

            <div>
              <MiniBookingCalendar
                onDateSelect={handleDateSelect}
                selectedDate={formData.date}
                selectedResource={resources.find((r) => String(r.id) === formData.resourceId)?.name}
                resources={resources}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateBookingPage
