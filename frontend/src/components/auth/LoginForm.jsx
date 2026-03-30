import React from 'react';

const LoginForm = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [message, setMessage] = React.useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		// Placeholder for login logic
		setMessage('Login functionality will be integrated with backend');
		console.log('Login attempt with:', { email, password });
		setTimeout(() => setMessage(''), 3000);
	};

	const handleGoogleLogin = () => {
		// Placeholder for Google login
		setMessage('Google login will be integrated with OAuth 2.0');
		console.log('Google login initiated');
		setTimeout(() => setMessage(''), 3000);
	};

	return (
		<div className="login-card">
			<p className="login-eyebrow">Smart Campus Operations Hub</p>
			<h1>Sign in to continue</h1>
			<p className="login-subtext">
				Use your account to access bookings, tickets, and campus operations modules.
			</p>

			<form className="auth-form" onSubmit={handleSubmit}>
				<label className="auth-label" htmlFor="login-email">
					Email
				</label>
				<input
					id="login-email"
					className="auth-input"
					type="email"
					autoComplete="email"
					placeholder="you@university.edu"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
				/>

				<label className="auth-label" htmlFor="login-password">
					Password
				</label>
				<input
					id="login-password"
					className="auth-input"
					type="password"
					autoComplete="current-password"
					placeholder="Enter your password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
				/>

				<button type="submit" className="btn btn-secondary auth-submit-btn">
					Sign In
				</button>
			</form>

			{message ? <p className="auth-message">{message}</p> : null}

			<div className="auth-divider">or</div>

			<button className="btn btn-primary login-google-btn" onClick={handleGoogleLogin}>
				Continue with Google
			</button>

			<p className="auth-alt-link">
				Don't have an account? <a href="/register">Create one</a>
			</p>
		</div>
	);
};

export default LoginForm;
