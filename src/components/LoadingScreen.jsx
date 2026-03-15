import { useEffect } from 'react'
import './LoadingScreen.css'

export default function LoadingScreen({ onComplete }) {
  useEffect(() => {
    // Show the loading screen for 2.5 seconds
    const timer = setTimeout(() => {
      onComplete()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1 className="loading-title">MATRINAX</h1>
      </div>
      <div className="loading-footer">
        <p>A PRODUCT FROM MATRINAX</p>
      </div>
    </div>
  )
}
