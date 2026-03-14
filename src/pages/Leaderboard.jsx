import { useState } from 'react'
import './Leaderboard.css'

const DEMO_BOARDS = {
  'Bench Press': [
    { rank: 1, name: 'BeastMike',   weight: 140, unit: 'kg', date: '2026-03-12' },
    { rank: 2, name: 'IronLex',     weight: 125, unit: 'kg', date: '2026-03-10' },
    { rank: 3, name: 'You',         weight: 80,  unit: 'kg', date: '2026-03-10', isYou: true },
    { rank: 4, name: 'LiftKing',    weight: 72.5,unit: 'kg', date: '2026-03-08' },
    { rank: 5, name: 'SteelNova',   weight: 65,  unit: 'kg', date: '2026-02-28' },
  ],
  'Deadlift': [
    { rank: 1, name: 'You',         weight: 140, unit: 'kg', date: '2026-03-08', isYou: true },
    { rank: 2, name: 'BeastMike',   weight: 135, unit: 'kg', date: '2026-03-06' },
    { rank: 3, name: 'SteelNova',   weight: 130, unit: 'kg', date: '2026-03-01' },
    { rank: 4, name: 'IronLex',     weight: 120, unit: 'kg', date: '2026-02-25' },
    { rank: 5, name: 'LiftKing',    weight: 110, unit: 'kg', date: '2026-02-20' },
  ],
  'Squat': [
    { rank: 1, name: 'LiftKing',    weight: 180, unit: 'kg', date: '2026-03-11' },
    { rank: 2, name: 'BeastMike',   weight: 160, unit: 'kg', date: '2026-03-09' },
    { rank: 3, name: 'SteelNova',   weight: 140, unit: 'kg', date: '2026-03-05' },
    { rank: 4, name: 'You',         weight: 100, unit: 'kg', date: '2026-03-05', isYou: true },
    { rank: 5, name: 'IronLex',     weight: 95,  unit: 'kg', date: '2026-02-22' },
  ],
  'Overhead Press': [
    { rank: 1, name: 'You',         weight: 55,  unit: 'kg', date: '2026-03-01', isYou: true },
    { rank: 2, name: 'IronLex',     weight: 52.5,unit: 'kg', date: '2026-02-28' },
    { rank: 3, name: 'BeastMike',   weight: 50,  unit: 'kg', date: '2026-02-25' },
  ],
}

const RANK_ICONS = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function Leaderboard() {
  const exercises = Object.keys(DEMO_BOARDS)
  const [selected, setSelected] = useState(exercises[0])
  const board = DEMO_BOARDS[selected]

  return (
    <div className="leaderboard-page page">
      <div className="container">

        <header className="page-header">
          <h1>Leaderboard</h1>
          <p style={{ marginTop: '0.5rem' }}>Global PRs. Where do you rank?</p>
        </header>

        {/* Exercise selector */}
        <div className="lb-exercises">
          {exercises.map(ex => (
            <button
              key={ex}
              onClick={() => setSelected(ex)}
              className={`day-pill ${selected === ex ? 'day-pill--active' : ''}`}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="podium">
          {board.slice(0, 3).map(entry => (
            <div
              key={entry.rank}
              className={`podium-entry podium-entry--${entry.rank} ${entry.isYou ? 'podium-entry--you' : ''}`}
            >
              <div className="podium-icon">{RANK_ICONS[entry.rank]}</div>
              <div className="podium-name">{entry.name}</div>
              <div className="podium-weight">{entry.weight} {entry.unit}</div>
            </div>
          ))}
        </div>

        {/* Full list */}
        <div className="lb-list">
          {board.map(entry => (
            <div
              key={entry.rank}
              className={`card lb-row ${entry.isYou ? 'lb-row--you' : ''}`}
            >
              <div className="lb-rank">
                {entry.rank <= 3
                  ? <span className="lb-rank-icon">{RANK_ICONS[entry.rank]}</span>
                  : <span className="lb-rank-num">#{entry.rank}</span>
                }
              </div>
              <div className="lb-info">
                <div className="lb-name">{entry.name}{entry.isYou && <span className="you-tag"> · You</span>}</div>
                <div className="lb-date">{formatDate(entry.date)}</div>
              </div>
              <div className="lb-weight">
                {entry.weight} <span className="lb-unit">{entry.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Encouragement */}
        <div className="card lb-cta" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '0.5rem' }}>Log a new PR to climb the board 💪</p>
          <a href="/log" className="btn btn-primary btn-sm">Log session →</a>
        </div>

      </div>
    </div>
  )
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
