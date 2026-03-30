import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [role, setRole] = React.useState('USER');
	const [message, setMessage] = React.useState('');
	const [submitting, setSubmitting] = React.useState(false);
	const { login, loginWithGoogle, roleHome } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage('');
		setSubmitting(true);
		try {
			const profile = await login({ email, password, role });
			const returnTo = location.state?.returnTo;
			navigate(returnTo || roleHome[profile.role] || '/', { replace: true });
		} catch (error) {
			setMessage(error.message || 'Unable to sign in.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleGoogleLogin = async () => {
		setMessage('');
		setSubmitting(true);
		try {
			const profile = await loginWithGoogle(role);
			navigate(roleHome[profile.role] || '/', { replace: true });
		} catch (error) {
			setMessage(error.message || 'Google sign-in failed.');
		} finally {
			setSubmitting(false);
		}
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

				<label className="auth-label" htmlFor="login-role">
					Role
				</label>
				<select
					id="login-role"
					className="auth-input"
					value={role}
					onChange={(event) => setRole(event.target.value)}
				>
					<option value="USER">USER</option>
					<option value="ADMIN">ADMIN</option>
				</select>

				<button type="submit" className="btn btn-secondary auth-submit-btn" disabled={submitting}>
					{submitting ? 'Signing In...' : 'Sign In'}
				</button>
			</form>

			{message ? <p className="auth-message">{message}</p> : null}

			<div className="auth-divider">or</div>

			<button className="btn btn-primary login-google-btn" onClick={handleGoogleLogin} disabled={submitting}>
				{submitting ? 'Please wait...' : 'Continue with Google'}
			</button>

			<p className="auth-alt-link">
				Don't have an account? <Link to="/register">Create one</Link>
			</p>
		</div>
	);
};

export default LoginForm;
