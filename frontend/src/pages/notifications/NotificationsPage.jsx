import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const severityChip = {
  HIGH: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
  MEDIUM: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  LOW: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
}

const sourceChip = {
  BOOKING: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
  MAINTENANCE: 'border-indigo-400/30 bg-indigo-500/10 text-indigo-200',
}

const formatDate = (value) => {
  if (!value) return 'Unknown time'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Unknown time'
  return parsed.toLocaleString()
}

const NotificationsPage = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNotifications()
  }, [user?.email, user?.role])

  const fetchNotifications = async () => {
    setIsLoading(true)
    setError('')

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
      const params = new URLSearchParams({
        role: user?.role || 'USER',
      })
      if (user?.email) {
        params.append('email', user.email)
      }

      const response = await fetch(`${apiUrl}/notifications?${params.toString()}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data = await response.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load notifications')
      console.error('Failed to load notifications', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateNotification = async (notificationId, action) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
      const params = new URLSearchParams({
        role: user?.role || 'USER',
      })
      if (user?.email) {
        params.append('email', user.email)
      }

      const endpoint = action === 'read'
        ? `${apiUrl}/notifications/${notificationId}/read?${params.toString()}`
        : `${apiUrl}/notifications/${notificationId}?${params.toString()}`

      const response = await fetch(endpoint, {
        method: action === 'read' ? 'PUT' : 'DELETE',
        credentials: 'include',
      })

      if (!response.ok && response.status !== 204) {
        throw new Error(`Failed to ${action} notification`)
      }

      if (action === 'read') {
        setNotifications((current) =>
          current.map((item) =>
            item.notificationId === notificationId ? { ...item, isRead: true } : item,
          ),
        )
      } else {
        setNotifications((current) => current.filter((item) => item.notificationId !== notificationId))
      }
    } catch (err) {
      setError(err.message || `Failed to ${action} notification`)
      console.error(`Failed to ${action} notification`, err)
    }
  }

  const title = user?.role === 'ADMIN' ? 'All Admin Notifications' : 'All Notifications'

  const summary = useMemo(() => {
    return {
      total: notifications.length,
      high: notifications.filter((item) => item.severity === 'HIGH').length,
      booking: notifications.filter((item) => item.sourceType === 'BOOKING').length,
      maintenance: notifications.filter((item) => item.sourceType === 'MAINTENANCE').length,
    }
  }, [notifications])

  return (
    <section className="py-8 px-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Notification Center
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          <p className="mt-2 text-slate-300">Review booking and maintenance updates in one place.</p>
        </div>
        <button
          onClick={fetchNotifications}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total</p>
          <p className="mt-1 text-2xl font-bold text-white">{summary.total}</p>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-rose-200/80">High Priority</p>
          <p className="mt-1 text-2xl font-bold text-rose-100">{summary.high}</p>
        </div>
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-sky-200/80">Booking</p>
          <p className="mt-1 text-2xl font-bold text-sky-100">{summary.booking}</p>
        </div>
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-indigo-200/80">Maintenance</p>
          <p className="mt-1 text-2xl font-bold text-indigo-100">{summary.maintenance}</p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        {isLoading ? (
          <div className="py-12 text-center text-slate-300">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-slate-200">No notifications yet</p>
            <p className="mt-1 text-xs text-slate-400">New booking and maintenance events will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => {
              const severityStyle = severityChip[item.severity] || severityChip.LOW
              const sourceStyle = sourceChip[item.sourceType] || sourceChip.BOOKING
              const unread = !item.isRead

              return (
                <article
                  key={item.notificationId}
                  className={`rounded-xl border px-4 py-4 transition ${
                    unread
                      ? 'border-cyan-400/30 bg-cyan-500/10'
                      : 'border-white/10 bg-slate-950/40'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${sourceStyle}`}>
                      {item.sourceType}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${severityStyle}`}>
                      {item.severity}
                    </span>
                    {unread ? (
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-200">
                        Unread
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
                        Read
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">{formatDate(item.createdAt)}</span>
                  </div>
                  <h2 className={`mt-2 text-sm font-semibold ${unread ? 'text-white' : 'text-slate-200'}`}>
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">{item.message}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {!item.isRead && (
                      <button
                        onClick={() => updateNotification(item.notificationId, 'read')}
                        className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => updateNotification(item.notificationId, 'delete')}
                      className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default NotificationsPage
