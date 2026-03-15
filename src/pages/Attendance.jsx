import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Attendance.css'
import { FlameIcon } from '../components/Icons'

export default function Attendance() {
  const [attendance, setAttendance] = useState(() => {
    try {
      const saved = localStorage.getItem('il_attendance')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Generate last 90 days
  const today = new Date()
  const days = []
  let currentStreak = 0
  let isStreakActive = true

  for (let i = 89; i >= 0; i--) {
    let d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const active = attendance.includes(dateStr)
    days.push({ date: dateStr, active })
    
    // Streak logic reading backwards
    if (active && isStreakActive) {
       currentStreak++
    } else if (i !== 0 && isStreakActive) { 
       // if we miss yesterday (or today isn't checked in yet, which breaks streak), well, let's just make a simple streak logic
       // actually, simple streak logic reading from today down:
       // we will calculate streak separately
    }
  }

  // Calculate actual streak properly
  const calculateStreak = () => {
    let s = 0;
    let checkDate = new Date()
    while(true) {
      const checkStr = checkDate.toISOString().slice(0, 10);
      if (attendance.includes(checkStr)) {
         s++;
         checkDate.setDate(checkDate.getDate() - 1);
      } else {
         // if today is missing, check yesterday
         if (s === 0 && checkStr === today.toISOString().slice(0, 10)) {
            checkDate.setDate(checkDate.getDate() - 1);
            if (attendance.includes(checkDate.toISOString().slice(0, 10))) {
               s++;
               checkDate.setDate(checkDate.getDate() - 1);
               continue;
            }
         }
         break;
      }
    }
    return s;
  }
  
  const streak = calculateStreak()

  function checkInToday() {
    const todayStr = new Date().toISOString().slice(0, 10)
    if (!attendance.includes(todayStr)) {
       const newAtt = [...attendance, todayStr]
       setAttendance(newAtt)
       localStorage.setItem('il_attendance', JSON.stringify(newAtt))
    }
  }

  return (
    <div className="attendance-page page">
      <div className="container">
      
        <header className="page-header" style={{ marginBottom: '2rem' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FlameIcon size={32} /> Streak & Attendance</h1>
          <p style={{ marginTop: '0.5rem' }}>Consistency is the only metric that matters.</p>
        </header>

        <div className="card stat-card card-accent" style={{ marginBottom: '2rem' }}>
          <div className="stat-num">{streak}</div>
          <div className="stat-label">Current Gym Day Streak</div>
        </div>

        <section className="dash-section">
           <div className="dash-section__label" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span>Last 90 Days</span>
             <span className="text-dim text-sm">{attendance.length} total sessions</span>
           </div>
           
           <div className="card heat-map-container">
             <div className="heat-map">
               {days.map((d, i) => (
                 <div 
                   key={i} 
                   className={`heat-cell ${d.active ? 'heat-cell--active' : ''}`}
                   title={d.active ? `Gym day on ${d.date}` : d.date}
                 />
               ))}
             </div>
             <div className="heat-map-legend">
                <span className="text-dim text-sm">Less</span>
                <div className="heat-cell" />
                <div className="heat-cell heat-cell--active" />
                <span className="text-dim text-sm">More</span>
             </div>
           </div>
        </section>

        <div style={{ marginTop: '2rem' }}>
           <button 
             className="btn btn-primary btn-full" 
             onClick={checkInToday}
             disabled={attendance.includes(today.toISOString().slice(0, 10))}
           >
             {attendance.includes(today.toISOString().slice(0, 10)) ? "Checked in today!" : "I'm at the gym! Check in"}
           </button>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
           <Link to="/dashboard" className="btn btn-ghost">Back to Dashboard</Link>
        </div>

      </div>
    </div>
  )
}
