import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('il_user') || '{}')
  const [name, setName] = useState(user.name || '')

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
              <div className="stat-num">6</div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="card profile-stat">
              <div className="stat-num">24</div>
              <div className="stat-label">Sessions</div>
            </div>
            <div className="card profile-stat">
              <div className="stat-num">6</div>
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
