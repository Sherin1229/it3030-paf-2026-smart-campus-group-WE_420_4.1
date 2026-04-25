import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
	return (
		<main className="w-full">
			<section className="px-4 py-12">
				<div className="mx-auto w-full max-w-6xl">
					<div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
						<span className="h-2 w-2 rounded-full bg-emerald-400" />
						Smart Campus Operations Hub
					</div>
					<h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
						Smarter Campus.
						<br />
						Seamless Operations.
					</h1>
					<p className="mt-4 max-w-3xl text-slate-300">
						A unified intelligent platform to manage facilities, bookings, maintenance tickets,
						and notifications with strict role-based precision.
					</p>
					<div className="mt-6 flex flex-wrap gap-3">
						<Link
							to="/login"
							className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-400"
						>
							Get Started
						</Link>
						<Link
							to="/about"
							className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
						>
							Explore Features
						</Link>
					</div>
					<div className="mt-8 grid gap-3 md:grid-cols-3">
						{[
							['1,200+', 'Resources Managed'],
							['98%', 'Uptime SLA'],
							['3 Roles', 'Access Controlled'],
						].map(([value, label]) => (
							<div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
								<p className="text-2xl font-bold text-white">{value}</p>
								<p className="text-sm text-slate-400">{label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="px-4 pb-12">
				<div className="mx-auto w-full max-w-6xl">
					<h2 className="text-2xl font-bold text-white">Core Features</h2>
					<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{[
							['📚', 'Facilities & Assets', 'Maintain a comprehensive catalogue of bookable resources with real-time availability tracking.'],
							['📅', 'Booking Management', 'Effortless resource booking with automated conflict detection and approval workflows.'],
							['🔧', 'Maintenance & Tickets', 'Track incident reports, assign technicians, and monitor resolution progress seamlessly.'],
							['🔔', 'Notifications', 'Stay updated with real-time notifications for bookings, approvals, and ticket updates.'],
						].map(([icon, title, desc]) => (
							<article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
								<div className="text-xl">{icon}</div>
								<h3 className="mt-2 text-base font-semibold text-white">{title}</h3>
								<p className="mt-1 text-sm text-slate-400">{desc}</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="px-4 pb-14">
				<div className="mx-auto w-full max-w-6xl rounded-2xl border border-blue-400/20 bg-blue-500/10 p-6 text-center">
					<h2 className="text-2xl font-bold text-white">Ready to transform your campus operations?</h2>
					<p className="mt-2 text-slate-300">
						Join your institution in modernizing facility and asset management.
					</p>
					<Link
						to="/login"
						className="mt-4 inline-flex rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
					>
						Sign In Now
					</Link>
				</div>
			</section>
		</main>
	);
};

export default HomePage;
