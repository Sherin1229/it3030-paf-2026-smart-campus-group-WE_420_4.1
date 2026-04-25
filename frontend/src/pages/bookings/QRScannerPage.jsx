import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const QRScannerPage = () => {
  const { user } = useAuth()
  const [scanResult, setScanResult] = useState(null)
  const [status, setStatus] = useState('idle') // idle, scanning, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    })

    scanner.render(onScanSuccess, onScanError)

    function onScanSuccess(result) {
      scanner.clear()
      setScanResult(result)
      handleCheckIn(result)
    }

    function onScanError(err) {
      // console.warn(err)
    }

    return () => {
      scanner.clear().catch(e => console.error("Scanner clear error", e))
    }
  }, [])

  const handleCheckIn = async (resourceCode) => {
    setStatus('processing')
    try {
      const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://10.50.20.47:8081/api'}/bookings/check-in?email=${user.email}&resourceCode=${resourceCode}`
      const response = await fetch(API_URL, { method: 'POST' })
      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Check-in Successful! You can now use the resource.')
      } else {
        setStatus('error')
        setMessage(data.message || 'Check-in failed. Please ensure you have an active booking for this time.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[60vh] flex-col items-center justify-center py-10"
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">Self Check-in</h1>
          <p className="mt-2 text-sm text-slate-400">Scan the QR code located at the resource entrance.</p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-white/10">
          <div id="reader" className="w-full"></div>
        </div>

        <AnimatePresence>
          {status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`mt-6 rounded-2xl p-6 text-center ${
                status === 'success' ? 'bg-emerald-500/10 ring-1 ring-emerald-500/20' :
                status === 'error' ? 'bg-rose-500/10 ring-1 ring-rose-500/20' :
                'bg-sky-500/10 ring-1 ring-sky-500/20'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                {status === 'processing' && <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />}
                {status === 'success' && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </div>
                )}
                <p className={`text-sm font-bold ${
                  status === 'success' ? 'text-emerald-400' :
                  status === 'error' ? 'text-rose-400' :
                  'text-sky-400'
                }`}>
                  {message || 'Processing your scan...'}
                </p>
                
                {(status === 'success' || status === 'error') && (
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 rounded-xl bg-white/5 px-6 py-2 text-xs font-bold text-white transition hover:bg-white/10"
                  >
                    Scan Again
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-center">
          <Link to="/dashboard/user/bookings" className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Bookings
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

export default QRScannerPage
