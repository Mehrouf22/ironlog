import { useState, useEffect } from 'react'
import './History.css'
import { FolderIcon } from '../components/Icons'

export default function History() {
  const [history, setHistory] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem('il_history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse history", e)
      }
    }
  }, [])

  function clearHistory() {
    if (confirm("Are you sure you want to clear ALL workout history? This cannot be undone.")) {
      localStorage.removeItem('il_history')
      setHistory({})
    }
  }

  // Sort dates descending
  const sortedDates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a))

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

    if (dateStr === today) return "Today"
    if (dateStr === yesterday) return "Yesterday"
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="history page">
      <div className="container">
        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>History</h1>
            <p className="text-dim">Review your past sessions</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={clearHistory}>Clear All</button>
        </header>

        {sortedDates.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', color: 'var(--text-dim)', opacity: 0.5 }}>
              <FolderIcon size={48} />
            </div>
            <p className="text-dim">No workout history found yet.</p>
            <p className="text-dim" style={{ fontSize: '0.9rem' }}>Go to the Log tab to start your first session!</p>
          </div>
        ) : (
          <div className="history-list">
            {sortedDates.map(date => (
              <div key={date} className="history-day-group">
                <div className="history-date-label">{formatDate(date)}</div>
                {history[date].map((session, idx) => (
                  <div key={idx} className="card history-card">
                    <div className="history-card-header">
                      <h3>{session.dayType} Day</h3>
                    </div>
                    
                    <div className="history-exercises">
                      {session.exercises.map((ex, exIdx) => {
                        const completedSets = ex.sets.filter(s => s.done)
                        if (completedSets.length === 0) return null

                        return (
                          <div key={exIdx} className="history-exercise-item">
                            <div className="history-exercise-name">{ex.name}</div>
                            <div className="history-sets-summary">
                              {completedSets.map((s, sIdx) => (
                                <span key={sIdx} className="set-tag">
                                  {s.weight}kg × {s.reps}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {sortedDates.length > 0 && (
          <div className="history-footer">
            <div className="dash-section__label" style={{ marginTop: '2rem' }}>Danger Zone</div>
            <div className="card reset-card">
              <p className="text-dim" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                Clearing history will permanently remove all recorded workout sessions.
              </p>
              <button className="btn btn-ghost btn-full" style={{ color: 'var(--red)', borderColor: 'var(--red)' }} onClick={clearHistory}>
                Clear All History Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
