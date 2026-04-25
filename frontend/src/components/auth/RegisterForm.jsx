import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { hasGoogleAuth } from '../../config/googleAuth';

const RegisterForm = () => {
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [message, setMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const { register, loginWithGoogle, roleHome } = useAuth();
	const navigate = useNavigate();

	const calculateStrength = (pass) => {
		let score = 0;
		if (!pass) return 0;
		if (pass.length > 6) score++;
		if (pass.length > 10) score++;
		if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
		if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
		return score;
	};

	const strength = calculateStrength(password);
	const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
	const strengthColors = ['bg-slate-700', 'bg-rose-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500'];

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage('');

		if (password !== confirmPassword) {
			setMessage('Passwords do not match.');
			return;
		}

		setSubmitting(true);
		try {
			const profile = await register({ name: fullName, email, password });
			navigate(roleHome[profile.role] || '/', { replace: true });
		} catch (error) {
			setMessage(error.message || 'Unable to register.');
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
			setMessage(error.message || 'Google sign-up failed.');
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
			<p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Join the Campus Community</p>
			<h1 className="mt-2 text-3xl font-bold text-white">Create your account</h1>
			<p className="mt-2 text-sm text-slate-300">Register with your details or continue instantly with Google.</p>

			<form className="mt-4 grid gap-2" onSubmit={handleSubmit}>
				<label className="mt-1 text-sm font-semibold text-slate-200" htmlFor="register-name">
					Full Name
				</label>
				<input
					id="register-name"
					className="w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
					type="text"
					autoComplete="name"
					placeholder="Your full name"
					value={fullName}
					onChange={(event) => setFullName(event.target.value)}
					required
				/>

				<label className="mt-1 text-sm font-semibold text-slate-200" htmlFor="register-email">
					Email
				</label>
				<input
					id="register-email"
					className="w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
					type="email"
					autoComplete="email"
					placeholder="you@university.edu"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
				/>

				<label className="mt-1 text-sm font-semibold text-slate-200" htmlFor="register-password">
					Password
				</label>
				<div className="relative">
					<input
						id="register-password"
						className="w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 pr-10 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
						type={showPassword ? 'text' : 'password'}
						autoComplete="new-password"
						placeholder="Create a password"
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

				<div className="mt-1">
					<div className="flex h-1 gap-1">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className={`h-full flex-1 rounded-full transition-colors duration-300 ${
									i <= strength ? strengthColors[strength] : 'bg-slate-700'
								}`}
							/>
						))}
					</div>
					<p className={`mt-1 text-[10px] font-medium uppercase tracking-wider ${strength > 0 ? 'text-slate-300' : 'text-slate-500'}`}>
						Strength: <span className={strength > 0 ? strengthColors[strength].replace('bg-', 'text-') : ''}>{strengthLabels[strength]}</span>
					</p>
				</div>

				<label className="mt-1 text-sm font-semibold text-slate-200" htmlFor="register-confirm-password">
					Confirm Password
				</label>
				<div className="relative">
					<input
						id="register-confirm-password"
						className="w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 pr-10 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
						type={showConfirmPassword ? 'text' : 'password'}
						autoComplete="new-password"
						placeholder="Confirm password"
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						required
					/>
					<button
						type="button"
						className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
					>
						{showConfirmPassword ? (
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
						)}
					</button>
				</div>

				<button
					type="submit"
					className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
					disabled={submitting}
				>
					{submitting ? 'Creating Account...' : 'Sign Up'}
				</button>
			</form>

			{message ? <p className="mt-3 text-sm text-rose-300">{message}</p> : null}

			<div className="my-3 text-center text-sm text-slate-400">or</div>

			{hasGoogleAuth ? (
				<div className="flex justify-center">
					<GoogleLogin
						onSuccess={handleGoogleSuccess}
						onError={() => setMessage('Google sign-up failed.')}
						theme="filled_blue"
						shape="pill"
						text="signup_with"
					/>
				</div>
			) : (
				<p className="text-center text-sm text-slate-400">
					Google sign-up is not configured for this environment.
				</p>
			)}

			<p className="mt-4 text-center text-sm text-slate-300">
				Already have an account? <Link to="/login">Sign in</Link>
			</p>
		</motion.div>
	);
};

export default RegisterForm;
