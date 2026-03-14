import { useState } from 'react'
import './Schedule.css'

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_TYPES = ['Rest', 'Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Full Body']

const DEFAULT_SPLIT = {
  Mon: 'Chest', Tue: 'Back', Wed: 'Shoulders', Thu: 'Legs', Fri: 'Arms', Sat: 'Full Body', Sun: 'Rest'
}

export default function Schedule() {
  const [split, setSplit] = useState(DEFAULT_SPLIT)

  function setDay(day, type) {
    setSplit(s => ({ ...s, [day]: type }))
  }

  const todayIdx = (new Date().getDay() + 6) % 7 // Mon=0
  const todayLabel = WEEK[todayIdx]

  return (
    <div className="schedule-page page">
      <div className="container">

        <header className="page-header">
          <h1>Schedule</h1>
          <p style={{ marginTop: '0.5rem' }}>Your weekly training split.</p>
        </header>

        <div className="split-list">
          {WEEK.map((day, i) => {
            const isToday = day === todayLabel
            const type = split[day]
            const isRest = type === 'Rest'
            return (
              <div key={day} className={`card split-row ${isToday ? 'split-row--today' : ''}`}>
                <div className="split-day">
                  <div className="split-day-name">{day}</div>
                  {isToday && <span className="badge badge-accent">Today</span>}
                </div>
                <div className="split-picker">
                  {DAY_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => setDay(day, t)}
                      className={`type-pill ${type === t ? 'type-pill--active' : ''} ${t === 'Rest' ? 'type-pill--rest' : ''}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>
          Save Split
        </button>

      </div>
    </div>
  )
}
