import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_TYPES = ['Rest', 'Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Full Body']

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('il_user') || '{}')
  const today = new Date()
  const dayLabel = DAYS[today.getDay()]

  const [todayType, setTodayType] = useState('Chest')

  // Fetch data from local storage

  const [water, setWater] = useState(() => {
    try {
      const saved = localStorage.getItem('il_nutrition_water')
      const todayString = new Date().toISOString().slice(0, 10)
      const data = saved ? JSON.parse(saved) : null
      if (data && data.date === todayString) return { cups: data.water || 0, goal: 8 }
      return { cups: 0, goal: 8 }
    } catch {
      return { cups: 0, goal: 8 }
    }
  })

  const [calories, setCalories] = useState(() => {
    try {
      const saved = localStorage.getItem('il_nutrition_log')
      const todayString = new Date().toISOString().slice(0, 10)
      const data = saved ? JSON.parse(saved) : null
      let eaten = 0
      if (data && data.date === todayString && data.log) {
        eaten = Object.values(data.log).flat().reduce((acc, f) => acc + f.kcal, 0)
      }
      return { eaten, goal: 2400 }
    } catch {
      return { eaten: 0, goal: 2400 }
    }
  })


  const waterProgress = Math.round((water.cups / water.goal) * 100)
  const calProgress = Math.round((calories.eaten / calories.goal) * 100)

  return (
    <div className="dashboard page">
      <div className="container">

        {/* Header */}
        <header className="dash-header">
          <div>
            <p className="dash-greeting">
              {getGreeting()}, <span className="dash-name">{user.name || 'Lifter'}</span>
            </p>
            <p className="dash-date">{dayLabel} · {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
          </div>
          <Link to="/profile" className="dash-avatar">
            {(user.name || 'U')[0].toUpperCase()}
          </Link>
        </header>

        {/* Today's workout selector */}
        <section className="dash-section">
          <div className="dash-section__label">Today</div>
          <div className="day-selector">
            {DAY_TYPES.map(d => (
              <button
                key={d}
                onClick={() => setTodayType(d)}
                className={`day-pill ${todayType === d ? 'day-pill--active' : ''}`}
              >
                {d}
              </button>
            ))}
          </div>
          <Link to="/log" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
            Start {todayType} Day →
          </Link>
          <Link to="/end-day" className="btn btn-ghost btn-full" style={{ marginTop: '0.5rem', color: 'var(--text-dim)' }}>
            Finish Day 🏁
          </Link>
        </section>



        <hr className="divider" />

        {/* Water & Calories */}
        <section className="dash-section">
          <div className="dash-section__label">Today's Health</div>
          <div className="health-grid">
            {/* Water */}
            <div className="card health-card">
              <div className="health-card__top">
                <span className="health-icon">💧</span>
                <div>
                  <div className="stat-num" style={{ fontSize: '1.5rem' }}>
                    {water.cups}<span className="stat-unit">/{water.goal}</span>
                  </div>
                  <div className="stat-label">Cups Water</div>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill progress-bar__fill--blue" style={{ width: `${waterProgress}%` }} />
              </div>
            </div>

            {/* Calories */}
            <div className="card health-card">
              <div className="health-card__top">
                <span className="health-icon">🍎</span>
                <div>
                  <div className="stat-num" style={{ fontSize: '1.5rem' }}>
                    {calories.eaten}<span className="stat-unit">kcal</span>
                  </div>
                  <div className="stat-label">of {calories.goal} goal</div>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill progress-bar__fill--green" style={{ width: `${calProgress}%` }} />
              </div>
            </div>
          </div>
          <Link to="/nutrition" className="btn btn-ghost btn-sm" style={{ marginTop: '0.75rem' }}>
            Log food + water →
          </Link>
        </section>

        <hr className="divider" />

        {/* Quick actions */}
        <section className="dash-section">
          <div className="dash-section__label">Quick Access</div>
          <div className="quick-grid">
            <QuickCard to="/prs" icon="🏆" label="My PRs" desc="All-time bests" />
            <QuickCard to="/attendance" icon="🔥" label="Streak" desc="Gym attendance" />
            <QuickCard to="/timer" icon="⏱️" label="Timer" desc="Set rest clock" />
            <QuickCard to="/notes" icon="📓" label="Notes" desc="Thoughts & tips" />
            <QuickCard to="/schedule" icon="📅" label="Schedule" desc="Weekly split" />
          </div>
        </section>

      </div>
    </div>
  )
}

function QuickCard({ to, icon, label, desc }) {
  return (
    <Link to={to} className="card quick-card">
      <span className="quick-card__icon">{icon}</span>
      <div>
        <div className="quick-card__label">{label}</div>
        <div className="quick-card__desc">{desc}</div>
      </div>
    </Link>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
