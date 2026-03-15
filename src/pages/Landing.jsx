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
        <div className="landing__logo" style={{ marginBottom: '2rem' }}>
          <span className="landing__logo-mark" style={{ 
            fontFamily: 'var(--font-brand)', 
            width: 'auto', 
            padding: '0 1rem', 
            height: '50px', 
            fontSize: '1.5rem',
            letterSpacing: '0.1em'
          }}>MATRINAX</span>
        </div>

        {/* Hero text */}
        <div className="landing__hero">
          <div className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>
            Beta · Mobile First
          </div>
          <h1 className="landing__title">
            Break limits.<br />
            Track results.<br />
            <span className="landing__title-accent">Become the machine.</span>
          </h1>
          <p className="landing__subtitle">
            MATRINAX is a minimal, performance-first engine for high-output athletes. Precision tracking, custom nutrition, and zero distractions.
          </p>
        </div>

        {/* Feature pills */}
        <div className="landing__features">
          {[
            '🏋️ Workout Engine',
            '🏆 PR Tracking',
            '⏱️ Rest Timer',
            '🥗 Custom Macros',
            '📓 Athlete Notes',
            '💧 Hydration',
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
