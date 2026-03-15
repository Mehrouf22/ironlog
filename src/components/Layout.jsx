import { NavLink, useLocation } from 'react-router-dom'
import './Layout.css'
import { HomeIcon, HistoryIcon, LogIcon, TrophyIcon, NoteIcon } from './Icons'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: HomeIcon },
  { to: '/history',   label: 'History', icon: HistoryIcon },
  { to: '/log',       label: 'Log',  icon: LogIcon  },
  { to: '/prs',       label: 'PRs',  icon: TrophyIcon },
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
