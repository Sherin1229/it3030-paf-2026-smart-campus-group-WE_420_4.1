import React from 'react';

const RegisterForm = () => {
	const [fullName, setFullName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');
	const [message, setMessage] = React.useState('');

	const handleSubmit = (event) => {
		event.preventDefault();

		if (password !== confirmPassword) {
			setMessage('Passwords do not match.');
			return;
		}

		// Placeholder for registration logic
		setMessage('Registration will be processed by the backend');
		console.log('Registration attempt with:', { fullName, email, password });
		setTimeout(() => setMessage(''), 3000);
	};

	const handleGoogleSignUp = () => {
		// Placeholder for Google sign-up
		setMessage('Google sign-up will be integrated with OAuth 2.0');
		console.log('Google sign-up initiated');
		setTimeout(() => setMessage(''), 3000);
	};

	return (
		<div className="login-card">
			<p className="login-eyebrow">Smart Campus Operations Hub</p>
			<h1>Create your account</h1>
			<p className="login-subtext">Register with your details or continue instantly with Google.</p>

			<form className="auth-form" onSubmit={handleSubmit}>
				<label className="auth-label" htmlFor="register-name">
					Full Name
				</label>
				<input
					id="register-name"
					className="auth-input"
					type="text"
					autoComplete="name"
					placeholder="Your full name"
					value={fullName}
					onChange={(event) => setFullName(event.target.value)}
					required
				/>

				<label className="auth-label" htmlFor="register-email">
					Email
				</label>
				<input
					id="register-email"
					className="auth-input"
					type="email"
					autoComplete="email"
					placeholder="you@university.edu"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
				/>

				<label className="auth-label" htmlFor="register-password">
					Password
				</label>
				<input
					id="register-password"
					className="auth-input"
					type="password"
					autoComplete="new-password"
					placeholder="Create a password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
				/>

				<label className="auth-label" htmlFor="register-confirm-password">
					Confirm Password
				</label>
				<input
					id="register-confirm-password"
					className="auth-input"
					type="password"
					autoComplete="new-password"
					placeholder="Confirm password"
					value={confirmPassword}
					onChange={(event) => setConfirmPassword(event.target.value)}
					required
				/>

				<button type="submit" className="btn btn-secondary auth-submit-btn">
					Sign Up
				</button>
			</form>

			{message ? <p className="auth-message">{message}</p> : null}

			<div className="auth-divider">or</div>

			<button className="btn btn-primary login-google-btn" onClick={handleGoogleSignUp}>
				Sign Up with Google
			</button>

			<p className="auth-alt-link">
				Already have an account? <a href="/login">Sign in</a>
			</p>
		</div>
	);
};

export default RegisterForm;
