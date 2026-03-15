import { Link } from 'react-router-dom'
import './Landing.css'
import { 
  TrophyIcon, 
  TimerIcon, 
  NutritionIcon, 
  NoteIcon, 
  DropletIcon, 
  FlameIcon, 
  LogIcon 
} from '../components/Icons'

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
            { icon: <LogIcon size={16} />, label: 'Workout Engine' },
            { icon: <TrophyIcon size={16} />, label: 'PR Tracking' },
            { icon: <TimerIcon size={16} />, label: 'Rest Timer' },
            { icon: <NutritionIcon size={16} />, label: 'Custom Macros' },
            { icon: <NoteIcon size={16} />, label: 'Athlete Notes' },
            { icon: <DropletIcon size={16} />, label: 'Hydration' },
          ].map((f, idx) => (
            <span key={idx} className="feature-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {f.icon} {f.label}
            </span>
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
        <p className="landing__footer-note" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          Built by a lifter. For lifters. <FlameIcon size={14} color="var(--accent)" />
        </p>
      </main>
    </div>
  )
}
