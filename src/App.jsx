import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import LoadingScreen from './components/LoadingScreen'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import WorkoutLog from './pages/WorkoutLog'
import PRs from './pages/PRs'
import Notes from './pages/Notes'
import Nutrition from './pages/Nutrition'
import Timer from './pages/Timer'
import Schedule from './pages/Schedule'
import Profile from './pages/Profile'
import EndDay from './pages/EndDay'
import Attendance from './pages/Attendance'

// Simple auth check — later swap with Supabase
const isLoggedIn = () => localStorage.getItem('il_auth') === 'true'

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

function App() {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes inside app shell */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>}
        />
        <Route
          path="/log"
          element={<PrivateRoute><Layout><WorkoutLog /></Layout></PrivateRoute>}
        />
        <Route
          path="/prs"
          element={<PrivateRoute><Layout><PRs /></Layout></PrivateRoute>}
        />
        <Route
          path="/notes"
          element={<PrivateRoute><Layout><Notes /></Layout></PrivateRoute>}
        />
        <Route
          path="/nutrition"
          element={<PrivateRoute><Layout><Nutrition /></Layout></PrivateRoute>}
        />
        <Route
          path="/timer"
          element={<PrivateRoute><Layout><Timer /></Layout></PrivateRoute>}
        />
        <Route
          path="/schedule"
          element={<PrivateRoute><Layout><Schedule /></Layout></PrivateRoute>}
        />
        <Route
          path="/profile"
          element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>}
        />
        <Route
          path="/end-day"
          element={<PrivateRoute><Layout><EndDay /></Layout></PrivateRoute>}
        />
        <Route
          path="/attendance"
          element={<PrivateRoute><Layout><Attendance /></Layout></PrivateRoute>}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
