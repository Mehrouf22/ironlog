import { useState } from 'react'
import './PRs.css'

const DEMO_PRS = []

const DAYS = ['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Arms']

export default function PRs() {
  const [filter, setFilter] = useState('All')
  const [prs, setPrs] = useState(() => {
    try {
      const saved = localStorage.getItem('il_prs')
      return saved ? Object.values(JSON.parse(saved)) : []
    } catch {
      return []
    }
  })

  function resetPRs() {
    if (confirm("Are you sure you want to reset all your Personal Records?")) {
      setPrs([])
      localStorage.setItem('il_prs', JSON.stringify({}))
    }
  }

  const filtered = filter === 'All'
    ? prs
    : prs.filter(p => p.day === filter)

  return (
    <div className="prs-page page">
      <div className="container">

        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Personal Records</h1>
            <p style={{ marginTop: '0.5rem' }}>Your all-time bests. Keep breaking them.</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={resetPRs}>Reset PRs</button>
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
