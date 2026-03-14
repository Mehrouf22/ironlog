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
  const [exercises, setExercises] = useState([
    { name: 'Bench Press', sets: [newSet()] }
  ])

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

  return (
    <div className="workout-log page">
      <div className="container">

        <header className="page-header">
          <h1>Log Workout</h1>
          <div className="day-badges">
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
          <div className="exercise-picker">
            {EXERCISES[dayType]?.filter(e => !exercises.find(ex => ex.name === e)).map(name => (
              <button key={name} className="ex-pill" onClick={() => addExercise(name)}>
                + {name}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>
          Save Session
        </button>
      </div>
    </div>
  )
}
