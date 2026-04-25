const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()
const PLACEHOLDER_GOOGLE_CLIENT_ID = 'your-google-client-id-here.apps.googleusercontent.com'

export const hasGoogleAuth = Boolean(
	GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== PLACEHOLDER_GOOGLE_CLIENT_ID,
)

export const googleClientId = hasGoogleAuth ? GOOGLE_CLIENT_ID : null