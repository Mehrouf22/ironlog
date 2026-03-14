import { useState, useEffect, useRef } from 'react'
import './Timer.css'

const PRESETS = [60, 90, 120, 180]

export default function Timer() {
  // --- Rest Timer ---
  const [timerSecs, setTimerSecs] = useState(90)
  const [timerRemain, setTimerRemain] = useState(90)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef(null)

  // --- Stopwatch ---
  const [swElapsed, setSwElapsed] = useState(0)
  const [swRunning, setSwRunning] = useState(false)
  const [swLaps, setSwLaps] = useState([])
  const swRef = useRef(null)

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerRemain(r => {
          if (r <= 1) {
            clearInterval(timerRef.current)
            setTimerRunning(false)
            return 0
          }
          return r - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [timerRunning])

  function setPreset(secs) {
    setTimerRunning(false)
    setTimerSecs(secs)
    setTimerRemain(secs)
  }

  function resetTimer() {
    setTimerRunning(false)
    setTimerRemain(timerSecs)
  }

  // Stopwatch logic
  useEffect(() => {
    if (swRunning) {
      swRef.current = setInterval(() => setSwElapsed(e => e + 10), 10)
    } else {
      clearInterval(swRef.current)
    }
    return () => clearInterval(swRef.current)
  }, [swRunning])

  function swLap() {
    setSwLaps(l => [formatSW(swElapsed), ...l])
  }

  function swReset() {
    setSwRunning(false)
    setSwElapsed(0)
    setSwLaps([])
  }

  const timerPct = timerRemain / timerSecs
  const r = 80
  const circ = 2 * Math.PI * r
  const dash = circ * timerPct

  return (
    <div className="timer-page page">
      <div className="container">
        <header className="page-header">
          <h1>Timer</h1>
        </header>

        {/* Rest Timer */}
        <section className="timer-section">
          <div className="section-label">Rest Timer</div>

          {/* Circular display */}
          <div className="timer-ring-wrap">
            <svg width="200" height="200" viewBox="0 0 200 200" className="timer-ring">
              <circle cx="100" cy="100" r={r} className="ring-bg" />
              <circle
                cx="100" cy="100" r={r}
                className="ring-fill"
                strokeDasharray={`${dash} ${circ}`}
                strokeDashoffset="0"
                transform="rotate(-90 100 100)"
                style={{ transition: timerRunning ? 'stroke-dasharray 1s linear' : 'none' }}
              />
            </svg>
            <div className="timer-digits">
              {formatTime(timerRemain)}
              {timerRemain === 0 && <div className="timer-done">Done! 💪</div>}
            </div>
          </div>

          {/* Presets */}
          <div className="timer-presets">
            {PRESETS.map(s => (
              <button
                key={s}
                onClick={() => setPreset(s)}
                className={`preset-btn ${timerSecs === s ? 'preset-btn--active' : ''}`}
              >
                {s}s
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="timer-controls">
            <button className="btn btn-ghost" onClick={resetTimer}>Reset</button>
            <button
              className="btn btn-primary"
              onClick={() => setTimerRunning(r => !r)}
              disabled={timerRemain === 0}
            >
              {timerRunning ? 'Pause' : timerRemain === timerSecs ? 'Start' : 'Resume'}
            </button>
          </div>
        </section>

        <hr className="divider" />

        {/* Stopwatch */}
        <section className="timer-section">
          <div className="section-label">Stopwatch</div>

          <div className="sw-display">{formatSW(swElapsed)}</div>

          <div className="timer-controls">
            <button className="btn btn-ghost" onClick={swLap} disabled={!swRunning}>Lap</button>
            <button
              className="btn btn-primary"
              onClick={() => setSwRunning(r => !r)}
            >
              {swRunning ? 'Stop' : swElapsed === 0 ? 'Start' : 'Resume'}
            </button>
            <button className="btn btn-ghost" onClick={swReset}>Reset</button>
          </div>

          {swLaps.length > 0 && (
            <div className="sw-laps">
              {swLaps.map((lap, i) => (
                <div key={i} className="sw-lap-row">
                  <span className="sw-lap-num">Lap {swLaps.length - i}</span>
                  <span className="sw-lap-time">{lap}</span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function formatSW(ms) {
  const m = Math.floor(ms / 60000).toString().padStart(2, '0')
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0')
  const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0')
  return `${m}:${s}.${cs}`
}
