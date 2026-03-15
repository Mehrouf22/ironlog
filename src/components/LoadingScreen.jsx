import { useEffect } from 'react'
import './LoadingScreen.css'

export default function LoadingScreen({ onComplete }) {
  useEffect(() => {
    // Show the loading screen for 3.5 seconds
    const timer = setTimeout(() => {
      onComplete()
    }, 3500)
    return () => clearTimeout(timer)
  }, [onComplete])

  const text = "MATRINAX"

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1 className="loading-title">
          {text.split('').map((char, i) => (
            <span key={i} style={{ '--index': i }}>{char}</span>
          ))}
        </h1>
      </div>
      <div className="loading-footer">
        <p>A PRODUCT FROM MATRINAX</p>
      </div>
    </div>
  )
}
