import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordPage = () => {
	const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [message, setMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const { forgotPassword, verifyOtp, resetPassword } = useAuth();
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

	const strength = calculateStrength(newPassword);
	const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
	const strengthColors = ['bg-slate-700', 'bg-rose-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500'];

	const handleSendOtp = async (e) => {
		e.preventDefault();
		setMessage('');
		setSubmitting(true);
		try {
			await forgotPassword(email);
			setStep(2);
			setMessage('OTP sent to your email.');
		} catch (error) {
			setMessage(error.message || 'Error sending OTP.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		setMessage('');
		setSubmitting(true);
		try {
			await verifyOtp(email, otp);
			setStep(3);
			setMessage('');
		} catch (error) {
			setMessage(error.message || 'Invalid OTP.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		setMessage('');
		if (newPassword !== confirmPassword) {
			setMessage('Passwords do not match.');
			return;
		}
		setSubmitting(true);
		try {
			await resetPassword(email, otp, newPassword);
			setMessage('Password reset successful! Redirecting to login...');
			setTimeout(() => navigate('/login'), 3000);
		} catch (error) {
			setMessage(error.message || 'Error resetting password.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6">
			<motion.div
				className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-md"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4 }}
			>
				<p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Account Recovery</p>
				<h1 className="mt-2 text-3xl font-bold text-white">
					{step === 1 && 'Reset your password'}
					{step === 2 && 'Verify OTP'}
					{step === 3 && 'New Password'}
				</h1>
				<p className="mt-2 text-sm text-slate-300">
					{step === 1 && 'Enter your email address and we will send you a 6-digit OTP to reset your password.'}
					{step === 2 && `We've sent a code to ${email}. Enter it below to proceed.`}
					{step === 3 && 'Create a strong new password for your account.'}
				</p>

				<form className="mt-6 grid gap-4" onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword}>
					{step === 1 && (
						<div>
							<label className="text-sm font-semibold text-slate-200" htmlFor="email">Email Address</label>
							<input
								id="email"
								type="email"
								className="mt-1 w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
								placeholder="you@university.edu"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
					)}

					{step === 2 && (
						<div>
							<label className="text-sm font-semibold text-slate-200" htmlFor="otp">Enter 6-digit OTP</label>
							<input
								id="otp"
								type="text"
								maxLength="6"
								className="mt-1 w-full text-center tracking-[1em] text-lg rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
								placeholder="000000"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								required
							/>
						</div>
					)}

					{step === 3 && (
						<>
							<div>
								<label className="text-sm font-semibold text-slate-200" htmlFor="newPassword">New Password</label>
								<div className="relative">
									<input
										id="newPassword"
										type={showPassword ? 'text' : 'password'}
										className="mt-1 w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 pr-10 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
										placeholder="••••••••"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
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
							</div>
							<div className="mt-[-8px]">
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
							<div>
								<label className="text-sm font-semibold text-slate-200" htmlFor="confirmPassword">Confirm Password</label>
								<div className="relative">
									<input
										id="confirmPassword"
										type={showConfirmPassword ? 'text' : 'password'}
										className="mt-1 w-full rounded-lg border border-slate-400/30 bg-slate-900/90 px-3 py-2 pr-10 text-sm text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
										placeholder="••••••••"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
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
							</div>
						</>
					)}

					<button
						type="submit"
						className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-indigo-900/20"
						disabled={submitting}
					>
						{submitting ? 'Please wait...' : step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
					</button>
				</form>

				{message && (
					<p className={`mt-4 text-center text-sm ${message.includes('successful') ? 'text-emerald-400' : 'text-rose-300'}`}>
						{message}
					</p>
				)}

				<p className="mt-6 text-center text-sm text-slate-300">
					Remember your password? <Link to="/login" className="text-indigo-300 hover:underline">Sign in</Link>
				</p>
			</motion.div>
		</section>
	);
};

export default ForgotPasswordPage;
