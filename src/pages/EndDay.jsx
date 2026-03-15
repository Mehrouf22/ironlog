import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './EndDay.css'

export default function EndDay() {
  const navigate = useNavigate()
  const todayString = new Date().toISOString().slice(0, 10)
  
  const [history] = useState(() => {
    try {
      const saved = localStorage.getItem('il_history')
      return saved ? (JSON.parse(saved)[todayString] || []) : []
    } catch {
      return []
    }
  })

  const [attendedToday] = useState(() => {
    try {
      const saved = localStorage.getItem('il_attendance')
      const arr = saved ? JSON.parse(saved) : []
      return arr.includes(todayString)
    } catch {
      return false
    }
  })

  const [nutrition] = useState(() => {
    try {
      const saved = localStorage.getItem('il_nutrition_log')
      const data = saved ? JSON.parse(saved) : null
      if (data && data.date === todayString && data.log) {
        return data.log
      }
      return null
    } catch {
      return null
    }
  })

  const [water] = useState(() => {
    try {
      const saved = localStorage.getItem('il_nutrition_water')
      const data = saved ? JSON.parse(saved) : null
      if (data && data.date === todayString) return data.water || 0
      return 0
    } catch {
      return 0
    }
  })

  // Workout metrics
  const totalWorkouts = history.length
  let totalSetsDone = 0
  let totalVolume = 0

  history.forEach(session => {
    session.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.done) {
          totalSetsDone++
          const w = parseFloat(set.weight) || 0
          const r = parseInt(set.reps, 10) || 0
          totalVolume += (w * r)
        }
      })
    })
  })

  // Nutrition metrics
  let totalCals = 0
  if (nutrition) {
    totalCals = Object.values(nutrition).flat().reduce((acc, f) => acc + f.kcal, 0)
  }

  function completeAndResetDay() {
    if (confirm("Are you sure you want to wrap up and reset today's stats to a blank slate? (Great for testing!)")) {
      // Clear today's history
      let hist = JSON.parse(localStorage.getItem('il_history')) || {}
      delete hist[todayString]
      localStorage.setItem('il_history', JSON.stringify(hist))

      // Clear today's nutrition & water
      localStorage.setItem('il_nutrition_log', JSON.stringify({ date: todayString, log: { Breakfast: [], Lunch: [], Dinner: [], Snack: [] } }))
      localStorage.setItem('il_nutrition_water', JSON.stringify({ date: todayString, water: 0 }))

      // Clear dash sets done
      let dashData = JSON.parse(localStorage.getItem('il_dashData')) || { date: todayString, setsDone: 0, streak: 0 }
      dashData.setsDone = 0
      localStorage.setItem('il_dashData', JSON.stringify(dashData))

      alert('Day recorded and reset! Blank slate ready.')
      navigate('/dashboard')
    }
  }

  return (
    <div className="end-day page">
      <div className="container" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        
        <div className="end-day-hero">
          <h1 className="hero-emoji">🏆</h1>
          <h2>Day Completed!</h2>
          <p className="text-dim">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          {attendedToday && (
            <div style={{ marginTop: '1rem', display: 'inline-block' }} className="badge badge-accent">
               ✅ Gym Check-In Complete!
            </div>
          )}
        </div>

        <section className="dash-section" style={{ textAlign: 'left', marginTop: '2rem' }}>
          <div className="dash-section__label">Workout Summary</div>
          <div className="stats-grid">
            <div className="card stat-card">
              <div className="stat-num">{totalWorkouts}</div>
              <div className="stat-label">Sessions</div>
            </div>
            <div className="card stat-card">
              <div className="stat-num">{totalSetsDone}</div>
              <div className="stat-label">Sets Completed</div>
            </div>
          </div>
          <div className="card" style={{ marginTop: '0.75rem' }}>
             <p style={{ fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Volume Moved</span>
                <span className="text-accent">{totalVolume.toLocaleString()} kg</span>
             </p>
          </div>
        </section>

        <section className="dash-section" style={{ textAlign: 'left', marginTop: '2rem' }}>
          <div className="dash-section__label">Nutrition Recap</div>
          <div className="stats-grid">
            <div className="card stat-card card-accent">
              <div className="stat-num">{totalCals}</div>
              <div className="stat-label">Calories Eaten</div>
              <p className="stat-sub">Goal: 2400</p>
            </div>
            <div className="card stat-card">
              <div className="stat-num" style={{ color: 'var(--blue)' }}>{water}</div>
              <div className="stat-label">Cups of Water</div>
              <p className="stat-sub">Goal: 8</p>
            </div>
          </div>
        </section>

        <section className="dash-section" style={{ textAlign: 'left', marginTop: '2rem' }}>
           <div className="dash-section__label">Activity Log</div>
           <div className="card">
              {history.length === 0 ? (
                <p className="text-dim">No workouts recorded today.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {history.map((sess, idx) => (
                    <div key={idx}>
                      <p style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: '0.25rem' }}>{sess.dayType} Day</p>
                      {sess.exercises.map((ex, exIdx) => {
                         const doneSets = ex.sets.filter(s => s.done).length
                         if (doneSets === 0) return null
                         return (
                           <div key={exIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border)' }}>
                             <span>{ex.name}</span>
                             <span className="text-dim">{doneSets} sets</span>
                           </div>
                         )
                      })}
                    </div>
                  ))}
                </div>
              )}
           </div>
        </section>

        <div style={{ marginTop: '3rem', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <button className="btn btn-primary btn-full" onClick={completeAndResetDay}>
             Complete Day & Reset Stats 🔄
           </button>
           <Link to="/dashboard" className="btn btn-ghost btn-full">Back to Home</Link>
        </div>

      </div>
    </div>
  )
}
