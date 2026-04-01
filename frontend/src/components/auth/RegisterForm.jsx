import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
	const [fullName, setFullName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');
	const [role, setRole] = React.useState('USER');
	const [message, setMessage] = React.useState('');
	const [submitting, setSubmitting] = React.useState(false);
	const { register, loginWithGoogle, roleHome } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage('');

		if (password !== confirmPassword) {
			setMessage('Passwords do not match.');
			return;
		}

		setSubmitting(true);
		try {
			const profile = await register({ name: fullName, email, password, role });
			navigate(roleHome[profile.role] || '/', { replace: true });
		} catch (error) {
			setMessage(error.message || 'Unable to register.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleGoogleSignUp = async () => {
		setMessage('');
		setSubmitting(true);
		try {
			const profile = await loginWithGoogle(role);
			navigate(roleHome[profile.role] || '/', { replace: true });
		} catch (error) {
			setMessage(error.message || 'Google sign-up failed.');
		} finally {
			setSubmitting(false);
		}
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

				<label className="auth-label" htmlFor="register-role">
					Role
				</label>
				<select
					id="register-role"
					className="auth-input"
					value={role}
					onChange={(event) => setRole(event.target.value)}
				>
					<option value="USER">USER</option>
					<option value="ADMIN">ADMIN</option>
				</select>

				<button type="submit" className="btn btn-secondary auth-submit-btn" disabled={submitting}>
					{submitting ? 'Creating Account...' : 'Sign Up'}
				</button>
			</form>

			{message ? <p className="auth-message">{message}</p> : null}

			<div className="auth-divider">or</div>

			<button className="btn btn-primary login-google-btn" onClick={handleGoogleSignUp} disabled={submitting}>
				{submitting ? 'Please wait...' : 'Sign Up with Google'}
			</button>

			<p className="auth-alt-link">
				Already have an account? <Link to="/login">Sign in</Link>
			</p>
		</div>
	);
};

export default RegisterForm;
