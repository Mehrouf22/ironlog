import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('il_user') || '{}')
  const [name, setName] = useState(user.name || '')

  const stats = (() => {
    try {
      const history = JSON.parse(localStorage.getItem('il_history') || '{}')
      const totalSessions = Object.values(history).flat().length
      
      const prs = JSON.parse(localStorage.getItem('il_prs') || '{}')
      const totalPRs = Object.keys(prs).length

      const attendance = JSON.parse(localStorage.getItem('il_attendance') || '[]')
      // Simple streak logic for display
      let currentStreak = 0
      let checkDate = new Date()
      while (true) {
        const dateStr = checkDate.toISOString().slice(0, 10)
        if (attendance.includes(dateStr)) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          // If today isn't logged yet, allow streak to continue from yesterday
          if (currentStreak === 0 && dateStr === new Date().toISOString().slice(0, 10)) {
            checkDate.setDate(checkDate.getDate() - 1)
            continue
          }
          break
        }
      }

      return { totalSessions, totalPRs, currentStreak }
    } catch {
      return { totalSessions: 0, totalPRs: 0, currentStreak: 0 }
    }
  })()

  function logout() {
    localStorage.removeItem('il_auth')
    localStorage.removeItem('il_user')
    navigate('/')
  }

  function save() {
    localStorage.setItem('il_user', JSON.stringify({ ...user, name }))
    alert('Profile saved!')
  }

  return (
    <div className="profile-page page">
      <div className="container">

        <header className="page-header">
          <h1>Profile</h1>
        </header>

        {/* Avatar */}
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            {(name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div className="profile-name">{name || 'Lifter'}</div>
            <div className="profile-email">{user.email || ''}</div>
          </div>
        </div>

        <hr className="divider" />

        {/* Edit form */}
        <div className="profile-section">
          <div className="section-label">Account</div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={save}>
            Save Changes
          </button>
        </div>

        <hr className="divider" />

        {/* Stats */}
        <div className="profile-section">
          <div className="section-label">Your Stats</div>
          <div className="profile-stats">
            <div className="card profile-stat">
              <div className="stat-num">{stats.currentStreak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="card profile-stat">
              <div className="stat-num">{stats.totalSessions}</div>
              <div className="stat-label">Sessions</div>
            </div>
            <div className="card profile-stat">
              <div className="stat-num">{stats.totalPRs}</div>
              <div className="stat-label">PRs Set</div>
            </div>
          </div>
        </div>

        <hr className="divider" />

        <button className="btn btn-ghost btn-full" onClick={logout} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
          Log Out
        </button>

      </div>
    </div>
  )
}
