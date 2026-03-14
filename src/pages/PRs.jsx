import { useState } from 'react'
import './PRs.css'

const DEMO_PRS = [
  { exercise: 'Bench Press',       day: 'Chest',     weight: 80,  unit: 'kg', date: '2026-03-10', prev: 77.5 },
  { exercise: 'Deadlift',          day: 'Back',      weight: 140, unit: 'kg', date: '2026-03-08', prev: 132.5 },
  { exercise: 'Squat',             day: 'Legs',      weight: 100, unit: 'kg', date: '2026-03-05', prev: 97.5 },
  { exercise: 'Overhead Press',    day: 'Shoulders', weight: 55,  unit: 'kg', date: '2026-03-01', prev: 52.5 },
  { exercise: 'Barbell Row',       day: 'Back',      weight: 85,  unit: 'kg', date: '2026-02-28', prev: 80 },
  { exercise: 'Incline Bench',     day: 'Chest',     weight: 65,  unit: 'kg', date: '2026-02-22', prev: 62.5 },
]

const DAYS = ['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Arms']

export default function PRs() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? DEMO_PRS
    : DEMO_PRS.filter(p => p.day === filter)

  return (
    <div className="prs-page page">
      <div className="container">

        <header className="page-header">
          <h1>Personal Records</h1>
          <p style={{ marginTop: '0.5rem' }}>Your all-time bests. Keep breaking them.</p>
        </header>

        {/* Filter tabs */}
        <div className="pr-filters">
          {DAYS.map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`day-pill ${filter === d ? 'day-pill--active' : ''}`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* PR cards */}
        <div className="pr-list">
          {filtered.map((pr, i) => {
            const gain = (pr.weight - pr.prev).toFixed(1)
            return (
              <div key={i} className="card pr-card card-accent">
                <div className="pr-card__top">
                  <div>
                    <h3 className="pr-exercise">{pr.exercise}</h3>
                    <span className="badge">{pr.day}</span>
                  </div>
                  <div className="pr-weight">
                    <span className="pr-num">{pr.weight}</span>
                    <span className="pr-unit">{pr.unit}</span>
                  </div>
                </div>
                <div className="pr-card__bottom">
                  <span className="pr-date">{formatDate(pr.date)}</span>
                  <span className="badge badge-accent">+{gain} {pr.unit}</span>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No PRs logged for {filter} yet.</p>
            <p>Start logging your workouts to set records.</p>
          </div>
        )}

      </div>
    </div>
  )
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
