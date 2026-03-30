import React from 'react';

const HomePage = () => {
	return (
		<main className="home-page">
			{/* Hero Section */}
			<section className="hero-section">
				<div className="container hero-inner">
					<div className="hero-content">
						<div className="hero-badge">
							<span className="hero-badge-dot" />
							Smart Campus Operations Hub
						</div>
						<h1>Smarter Campus.<br />Seamless Operations.</h1>
						<p>
							A unified intelligent platform to manage facilities, bookings, maintenance tickets,
							and notifications — with strict role-based precision.
						</p>
						<div className="hero-actions">
							<a href="/login" className="btn btn-primary">Get Started →</a>
							<button className="btn btn-secondary">Explore Features</button>
						</div>
						<div className="hero-stats">
							<div>
								<div className="hero-stat-value">1,200+</div>
								<div className="hero-stat-label">Resources Managed</div>
							</div>
							<div>
								<div className="hero-stat-value">98%</div>
								<div className="hero-stat-label">Uptime SLA</div>
							</div>
							<div>
								<div className="hero-stat-value">3 Roles</div>
								<div className="hero-stat-label">Access Controlled</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="features-section">
				<div className="container">
					<h2>Core Features</h2>
					<div className="features-grid">
						<div className="feature-card">
							<div className="feature-icon">📚</div>
							<h3>Facilities & Assets</h3>
							<p>Maintain a comprehensive catalogue of bookable resources with real-time availability tracking.</p>
						</div>
						<div className="feature-card">
							<div className="feature-icon">📅</div>
							<h3>Booking Management</h3>
							<p>Effortless resource booking with automated conflict detection and approval workflows.</p>
						</div>
						<div className="feature-card">
							<div className="feature-icon">🔧</div>
							<h3>Maintenance & Tickets</h3>
							<p>Track incident reports, assign technicians, and monitor resolution progress seamlessly.</p>
						</div>
						<div className="feature-card">
							<div className="feature-icon">🔔</div>
							<h3>Notifications</h3>
							<p>Stay updated with real-time notifications for bookings, approvals, and ticket updates.</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="cta-section">
				<div className="container cta-inner">
					<h2>Ready to transform your campus operations?</h2>
					<p>Join your institution in modernizing facility and asset management.</p>
					<a href="/login" className="btn btn-primary">Sign In Now</a>
				</div>
			</section>
		</main>
	);
};

export default HomePage;
