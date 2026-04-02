import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
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
			const profile = await login({ email, password });
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
			const profile = await loginWithGoogle();
			navigate(roleHome[profile.role] || '/', { replace: true });
		} catch (error) {
			setMessage(error.message || 'Google sign-in failed.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20">
			<p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Smart Campus Operations Hub</p>
			<h1 className="mt-2 text-3xl font-bold text-white">Sign in to continue</h1>
			<p className="mt-2 text-sm text-slate-300">
				Use your account to access bookings, tickets, and campus operations modules.
			</p>

			<form className="mt-4 grid gap-2" onSubmit={handleSubmit}>
				<label className="mt-1 text-sm font-semibold text-slate-200" htmlFor="login-email">
					Email
				</label>
				<input
					id="login-email"
					className="w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
					type="email"
					autoComplete="email"
					placeholder="you@university.edu"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
				/>

				<label className="mt-1 text-sm font-semibold text-slate-200" htmlFor="login-password">
					Password
				</label>
				<input
					id="login-password"
					className="w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
					type="password"
					autoComplete="current-password"
					placeholder="Enter your password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
				/>

				<button
					type="submit"
					className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
					disabled={submitting}
				>
					{submitting ? 'Signing In...' : 'Sign In'}
				</button>
			</form>

			{message ? <p className="mt-3 text-sm text-rose-300">{message}</p> : null}

			<p className="mt-2 text-xs text-slate-400">
				Admin access uses the permanent admin credential.
			</p>

			<div className="my-3 text-center text-sm text-slate-400">or</div>

			<button
				className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
				onClick={handleGoogleLogin}
				disabled={submitting}
			>
				{submitting ? 'Please wait...' : 'Continue with Google'}
			</button>

			<p className="mt-4 text-center text-sm text-slate-300">
				Don't have an account? <Link to="/register">Create one</Link>
			</p>
		</div>
	);
};

export default LoginForm;
