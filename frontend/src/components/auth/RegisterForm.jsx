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
		<div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20">
			<p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Smart Campus Operations Hub</p>
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
				<input
					id="register-password"
					className="w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
					type="password"
					autoComplete="new-password"
					placeholder="Create a password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
				/>

				<label className="mt-1 text-sm font-semibold text-slate-200" htmlFor="register-confirm-password">
					Confirm Password
				</label>
				<input
					id="register-confirm-password"
					className="w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
					type="password"
					autoComplete="new-password"
					placeholder="Confirm password"
					value={confirmPassword}
					onChange={(event) => setConfirmPassword(event.target.value)}
					required
				/>

				<label className="mt-1 text-sm font-semibold text-slate-200" htmlFor="register-role">
					Role
				</label>
				<select
					id="register-role"
					className="w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
					value={role}
					onChange={(event) => setRole(event.target.value)}
				>
					<option value="USER">USER</option>
					<option value="ADMIN">ADMIN</option>
				</select>

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

			<button
				className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
				onClick={handleGoogleSignUp}
				disabled={submitting}
			>
				{submitting ? 'Please wait...' : 'Sign Up with Google'}
			</button>

			<p className="mt-4 text-center text-sm text-slate-300">
				Already have an account? <Link to="/login">Sign in</Link>
			</p>
		</div>
	);
};

export default RegisterForm;
