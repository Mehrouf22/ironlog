import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Placeholder auth — swap for Supabase later
    setTimeout(() => {
      if (form.name && form.email && form.password.length >= 6) {
        localStorage.setItem('il_auth', 'true')
        localStorage.setItem('il_user', JSON.stringify({ email: form.email, name: form.name }))
        navigate('/dashboard')
      } else if (form.password.length < 6) {
        setError('Password must be at least 6 characters.')
        setLoading(false)
      } else {
        setError('Please fill in all fields.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <span className="auth-logo__mark">IL</span>
          <span className="auth-logo__name">IronLog</span>
        </Link>

        <div className="auth-header">
          <h1>Create account</h1>
          <p>Start tracking your gains today.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="signup-name" className="form-label">Display name</label>
            <input
              id="signup-name"
              type="text"
              name="name"
              placeholder="IronMike"
              value={form.name}
              onChange={handleChange}
              autoComplete="nickname"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">Email</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password" className="form-label">Password</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-switch__link">Log in</Link>
        </p>
      </div>
    </div>
  )
}
