import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://10.50.20.47:8081/api'}/bookings`

const VerifyBookingPage = () => {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyBooking = async () => {
      if (!code) {
        setError('No booking code provided.')
        setLoading(false)
        return
      }

      try {
        // Since we don't have a specific "get by code" endpoint yet, 
        // we'll fetch all and find it, or we could add a backend endpoint.
        // For now, let's assume the user might be scanning their own, 
        // or we can add a public verification endpoint in the backend.
        // I'll add a public endpoint in the backend in the next step.
        const response = await fetch(`${API_BASE_URL}/verify?code=${code}`)
        if (!response.ok) {
          if (response.status === 404) throw new Error('Invalid booking pass.')
          throw new Error('Verification service unavailable.')
        }
        const data = await response.json()
        setBooking(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    verifyBooking()
  }, [code])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-white relative">
      <div className="mb-10 text-center">
        <h2 className="text-xl font-black tracking-tighter text-white sm:text-2xl">
          SMART<span className="text-sky-400">CAMPUS</span>HUB
        </h2>
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mt-1">Verification System</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-sky-500/10 p-4 ring-1 ring-sky-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold">Booking Verification</h1>
        
        {loading ? (
          <div className="mt-8 flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
            <p className="mt-4 text-slate-400">Verifying digital pass...</p>
          </div>
        ) : error ? (
          <div className="mt-8">
            <div className="rounded-2xl bg-rose-500/10 p-4 ring-1 ring-rose-500/20">
              <p className="text-sm font-medium text-rose-300">{error}</p>
            </div>
            <Link to="/" className="mt-6 inline-block text-sm font-semibold text-sky-400 hover:text-sky-300">
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="mt-8 text-left space-y-4">
            <div className="rounded-2xl bg-emerald-500/10 p-4 text-center ring-1 ring-emerald-500/20">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Access Granted</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-500">Resource</p>
                <p className="text-sm font-medium">{booking.resourceName}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-500">Status</p>
                <p className="text-sm font-medium text-sky-400">{booking.status}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-500">Requester</p>
                <p className="text-sm font-medium truncate">{booking.requesterEmail}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-500">Date</p>
                <p className="text-sm font-medium">{booking.date}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-semibold uppercase text-slate-500">Time Slot</p>
                <p className="text-sm font-medium">{booking.startTime} - {booking.endTime}</p>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-center text-[10px] text-slate-500 italic">
                Digitally signed and verified by Smart Campus Hub Security
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default VerifyBookingPage
