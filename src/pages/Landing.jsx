import { Link } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  return (
    <div className="landing">
      {/* Subtle background texture */}
      <div className="landing__bg" aria-hidden="true">
        <div className="landing__bg-dot" />
      </div>

      <main className="landing__main">
        {/* Logo */}
        <div className="landing__logo">
          <span className="landing__logo-mark">IL</span>
        </div>

        {/* Hero text */}
        <div className="landing__hero">
          <div className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>
            Beta · Mobile First
          </div>
          <h1 className="landing__title">
            Train harder.<br />
            Track smarter.<br />
            <span className="landing__title-accent">Outlift everyone.</span>
          </h1>
          <p className="landing__subtitle">
            IronLog is the gym companion for serious athletes. Log PRs, beat the leaderboard, and never miss a set.
          </p>
        </div>

        {/* Feature pills */}
        <div className="landing__features">
          {[
            '🏋️ PR Tracking',
            '🌍 Leaderboards',
            '⏱️ Set Timer',
            '🍎 Nutrition',
            '📓 Notes',
            '💧 Water',
          ].map(f => (
            <span key={f} className="feature-pill">{f}</span>
          ))}
        </div>

        {/* CTAs */}
        <div className="landing__actions">
          <Link to="/signup" className="btn btn-primary btn-lg btn-full">
            Start Training Free
          </Link>
          <Link to="/login" className="btn btn-ghost btn-lg btn-full">
            I already have an account
          </Link>
        </div>

        {/* Footer note */}
        <p className="landing__footer-note">
          Built by a lifter. For lifters. 🔥
        </p>
      </main>
    </div>
  )
}
