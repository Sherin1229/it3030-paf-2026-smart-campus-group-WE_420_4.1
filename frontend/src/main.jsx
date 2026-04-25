import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { googleClientId, hasGoogleAuth } from './config/googleAuth'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {hasGoogleAuth ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </GoogleOAuthProvider>
      ) : (
        <AuthProvider>
          <App />
        </AuthProvider>
      )}
    </BrowserRouter>
  </StrictMode>,
)
