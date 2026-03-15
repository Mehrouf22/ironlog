import { useState } from 'react'
import './WorkoutLog.css'

const EXERCISES = {
  Chest:     ['Bench Press', 'Incline Bench Press', 'Dumbbell Fly', 'Cable Fly', 'Dips'],
  Back:      ['Deadlift', 'Barbell Row', 'Pull-ups', 'Lat Pulldown', 'Seated Row'],
  Shoulders: ['Overhead Press', 'Lateral Raises', 'Arnold Press', 'Front Raise', 'Rear Delt Fly'],
  Legs:      ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl', 'Calf Raise'],
  Arms:      ['Barbell Curl', 'Hammer Curl', 'Tricep Pushdown', 'Skull Crushers', 'Dips'],
  'Full Body': ['Squat', 'Deadlift', 'Bench Press', 'Pull-ups', 'Overhead Press'],
}

function newSet() { return { reps: '', weight: '', note: '', done: false } }

export default function WorkoutLog() {
  const [dayType, setDayType] = useState('Chest')
  const [exercises, setExercises] = useState([])
  const [customEx, setCustomEx] = useState('')

  function addExercise(name) {
    setExercises(ex => [...ex, { name, sets: [newSet()] }])
  }

  function addSet(exIdx) {
    setExercises(ex => ex.map((e, i) =>
      i === exIdx ? { ...e, sets: [...e.sets, newSet()] } : e
    ))
  }

  function updateSet(exIdx, setIdx, field, value) {
    setExercises(ex => ex.map((e, i) =>
      i !== exIdx ? e : {
        ...e,
        sets: e.sets.map((s, j) =>
          j !== setIdx ? s : { ...s, [field]: value }
        )
      }
    ))
  }

  function toggleDone(exIdx, setIdx) {
    setExercises(ex => ex.map((e, i) =>
      i !== exIdx ? e : {
        ...e,
        sets: e.sets.map((s, j) =>
          j !== setIdx ? s : { ...s, done: !s.done }
        )
      }
    ))
  }

  function removeExercise(exIdx) {
    setExercises(ex => ex.filter((_, i) => i !== exIdx))
  }

  function saveSession() {
    if (exercises.length === 0) {
      alert('Add some exercises to log your session!')
      return
    }

    const currentPRs = JSON.parse(localStorage.getItem('il_prs')) || {}
    let newPrs = { ...currentPRs }
    let setsDoneThisSession = 0

    exercises.forEach(ex => {
      let maxWeight = 0
      ex.sets.forEach(set => {
        const w = parseFloat(set.weight)
        const r = parseInt(set.reps, 10)
        
        // Auto-mark as done if user typed both reps and weight
        const isFilled = !isNaN(w) && !isNaN(r) && w > 0 && r > 0

        if (set.done || isFilled) {
          set.done = true
          setsDoneThisSession++
          if (!isNaN(w)) {
            maxWeight = Math.max(maxWeight, w)
          }
        }
      })

      if (maxWeight > 0) {
        const existing = newPrs[ex.name]
        if (!existing || maxWeight > existing.weight) {
          newPrs[ex.name] = {
            exercise: ex.name,
            day: dayType,
            weight: maxWeight,
            unit: 'kg',
            date: new Date().toISOString().slice(0, 10),
            prev: existing ? existing.weight : 0
          }
        }
      }
    })

    if (setsDoneThisSession === 0) {
      alert('Complete at least one set to save!')
      return
    }

    localStorage.setItem('il_prs', JSON.stringify(newPrs))

    const todayString = new Date().toISOString().slice(0, 10)

    let history = JSON.parse(localStorage.getItem('il_history')) || {}
    let todayWorkout = history[todayString] || []
    todayWorkout.push({ dayType, exercises })
    history[todayString] = todayWorkout
    localStorage.setItem('il_history', JSON.stringify(history))

    // Automatically mark attendance
    let attendance = JSON.parse(localStorage.getItem('il_attendance')) || []
    if (!attendance.includes(todayString)) {
       attendance.push(todayString)
       localStorage.setItem('il_attendance', JSON.stringify(attendance))
    }

    let dashData = JSON.parse(localStorage.getItem('il_dashData')) || { date: todayString, setsDone: 0, streak: 0 }
    if (dashData.date !== todayString) {
      // Very basic streak logic update
      dashData.streak = dashData.streak + 1
      dashData.date = todayString
      dashData.setsDone = 0
    }
    dashData.setsDone += setsDoneThisSession
    localStorage.setItem('il_dashData', JSON.stringify(dashData))

    alert('Session saved and PRs updated!')
    setExercises([])
  }

  return (
    <div className="workout-log page">
      <div className="container">

        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Log Workout</h1>
            <div className="day-badges" style={{ marginTop: '0.5rem' }}>
              {Object.keys(EXERCISES).map(d => (
                <button
                  key={d}
                  onClick={() => setDayType(d)}
                  className={`day-pill ${dayType === d ? 'day-pill--active' : ''}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            if (confirm("Are you sure you want to clear your current unsaved session?")) setExercises([])
          }}>Clear</button>
        </header>


        {/* Exercise list */}
        <div className="exercise-list">
          {exercises.map((ex, exIdx) => (
            <div key={exIdx} className="card exercise-card">
              <div className="exercise-header">
                <h3>{ex.name}</h3>
                <button className="btn-icon" onClick={() => removeExercise(exIdx)} title="Remove">✕</button>
              </div>

              {/* Sets */}
              <div className="sets-table">
                <div className="sets-row sets-row--head">
                  <span>Set</span>
                  <span>Reps</span>
                  <span>kg</span>
                  <span></span>
                </div>
                {ex.sets.map((set, setIdx) => (
                  <div key={setIdx} className={`sets-row ${set.done ? 'sets-row--done' : ''}`}>
                    <span className="set-num">{setIdx + 1}</span>
                    <input
                      type="number"
                      className="set-input"
                      placeholder="—"
                      value={set.reps}
                      onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                    />
                    <input
                      type="number"
                      className="set-input"
                      placeholder="—"
                      value={set.weight}
                      onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                    />
                    <button
                      className={`check-btn ${set.done ? 'check-btn--done' : ''}`}
                      onClick={() => toggleDone(exIdx, setIdx)}
                    >
                      {set.done ? '✓' : '○'}
                    </button>
                  </div>
                ))}
              </div>

              <button className="btn btn-ghost btn-sm" onClick={() => addSet(exIdx)}>
                + Add Set
              </button>
            </div>
          ))}
        </div>

        {/* Add exercise */}
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="dash-section__label" style={{ marginBottom: '0.75rem' }}>Add Exercise — {dayType}</div>
          <div className="exercise-picker" style={{ marginBottom: '1rem' }}>
            {EXERCISES[dayType]?.filter(e => !exercises.find(ex => ex.name === e)).map(name => (
              <button key={name} className="ex-pill" onClick={() => addExercise(name)}>
                + {name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <input type="text" placeholder="Custom exercise name" className="set-input" style={{ flex: 1, textAlign: 'left', padding: '0.5rem' }} value={customEx} onChange={e => setCustomEx(e.target.value)} />
             <button className="btn btn-primary btn-sm" onClick={() => { if(customEx.trim()) { addExercise(customEx.trim()); setCustomEx('') } }}>Add</button>
          </div>
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }} onClick={saveSession}>
          Save Session
        </button>
      </div>
    </div>
  )
}
