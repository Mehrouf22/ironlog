import { NavLink, useLocation } from 'react-router-dom'
import './Layout.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: HomeIcon },
  { to: '/log',       label: 'Log',  icon: LogIcon  },
  { to: '/prs',       label: 'PRs',  icon: TrophyIcon },
  { to: '/leaderboard', label: 'Board', icon: BoardIcon },
  { to: '/notes',     label: 'Notes', icon: NoteIcon },
]

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <main className="main-content">
        {children}
      </main>
      <nav className="bottom-nav">
        <div className="bottom-nav__inner">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <span className="nav-item__icon"><Icon /></span>
              <span className="nav-item__label">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

/* ---- Icons (thin SVG, Muji style) ---- */
function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.75L12 3l9 6.75V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.75Z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}
function LogIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M8 7h8M8 12h8M8 17h5"/>
    </svg>
  )
}
function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12M6 3a6 6 0 0 0 6 9 6 6 0 0 0 6-9M6 3H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4h.5M18 3h2a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4h-.5"/>
      <path d="M12 12v4M8 21h8M9 17h6"/>
    </svg>
  )
}
function BoardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6"/>
    </svg>
  )
}
function NoteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9l-6-6Z"/>
      <path d="M15 3v6h6M8 13h8M8 17h5"/>
    </svg>
  )
}
