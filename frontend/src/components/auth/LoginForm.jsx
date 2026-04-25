import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { hasGoogleAuth } from '../../config/googleAuth';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);
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

	const handleGoogleSuccess = async (credentialResponse) => {
		setMessage('');
		setSubmitting(true);
		try {
			const profile = await loginWithGoogle(credentialResponse.credential);
			navigate(roleHome[profile.role] || '/', { replace: true });
		} catch (error) {
			setMessage(error.message || 'Google sign-in failed.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<motion.div
			className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
		>
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
				<div className="relative">
					<input
						id="login-password"
						className="w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 pr-10 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
						type={showPassword ? 'text' : 'password'}
						autoComplete="current-password"
						placeholder="Enter your password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
					/>
					<button
						type="button"
						className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? (
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
						)}
					</button>
				</div>

				<div className="flex justify-end mt-1">
					<Link to="/forgot-password" size="sm" className="text-xs text-indigo-300 hover:text-indigo-200">
						Forgot password?
					</Link>
				</div>

				<button
					type="submit"
					className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
					disabled={submitting}
				>
					{submitting ? 'Signing In...' : 'Sign In'}
				</button>
			</form>

			{message ? <p className="mt-3 text-sm text-rose-300">{message}</p> : null}

			<div className="my-3 text-center text-sm text-slate-400">or</div>

			{hasGoogleAuth ? (
				<div className="flex justify-center">
					<GoogleLogin
						onSuccess={handleGoogleSuccess}
						onError={() => setMessage('Google sign-in failed.')}
						theme="filled_blue"
						shape="pill"
					/>
				</div>
			) : (
				<p className="text-center text-sm text-slate-400">
					Google sign-in is not configured for this environment.
				</p>
			)}

			<p className="mt-4 text-center text-sm text-slate-300">
				Don't have an account? <Link to="/register">Create one</Link>
			</p>
		</motion.div>
	);
};

export default LoginForm;
