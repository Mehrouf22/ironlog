import { useState } from 'react'
import './Notes.css'

const TAGS = ['#general', '#chest', '#back', '#legs', '#form-tip', '#nutrition', '#mindset']

const DEMO_NOTES = []

export default function Notes() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('il_notes')
      return saved ? JSON.parse(saved) : DEMO_NOTES
    } catch {
      return DEMO_NOTES
    }
  })
  const [newText, setNewText] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [filter, setFilter] = useState('all')

  function toggleTag(tag) {
    setSelectedTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag])
  }

  function saveNotes(newNotes) {
    setNotes(newNotes)
    localStorage.setItem('il_notes', JSON.stringify(newNotes))
  }

  function addNote() {
    if (!newText.trim()) return
    const note = {
      id: Date.now(),
      content: newText.trim(),
      tags: selectedTags,
      highlight: false,
      pinned: false,
      date: new Date().toISOString().slice(0, 10)
    }
    const newNotes = [note, ...notes]
    saveNotes(newNotes)
    setNewText('')
    setSelectedTags([])
  }

  function toggleHighlight(id) {
    saveNotes(notes.map(note => note.id === id ? { ...note, highlight: !note.highlight } : note))
  }

  function togglePin(id) {
    saveNotes(notes.map(note => note.id === id ? { ...note, pinned: !note.pinned } : note))
  }

  function deleteNote(id) {
    saveNotes(notes.filter(note => note.id !== id))
  }

  const sorted = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return b.pinned - a.pinned
    return 0
  })

  const filtered = filter === 'highlights'
    ? sorted.filter(n => n.highlight)
    : filter === 'pinned'
    ? sorted.filter(n => n.pinned)
    : sorted

  return (
    <div className="notes-page page">
      <div className="container">

        <header className="page-header">
          <h1>Notes</h1>
          <p style={{ marginTop: '0.5rem' }}>Your gym brain. Write it down.</p>
        </header>

        {/* New note */}
        <div className="card new-note-card">
          <textarea
            className="note-textarea"
            placeholder="What's on your mind? Form tips, breakthroughs, reminders…"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            rows={3}
          />
          <div className="note-tags-row">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`tag-pill ${selectedTags.includes(tag) ? 'tag-pill--active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
          <button
            onClick={addNote}
            className="btn btn-primary btn-sm"
            disabled={!newText.trim()}
          >
            Add Note
          </button>
        </div>

        {/* Filter */}
        <div className="notes-filter">
          {['all', 'highlights', 'pinned'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`day-pill ${filter === f ? 'day-pill--active' : ''}`}
            >
              {f === 'all' ? 'All' : f === 'highlights' ? '⭐ Highlights' : '📌 Pinned'}
            </button>
          ))}
        </div>

        {/* Notes list */}
        <div className="notes-list">
          {filtered.map(note => (
            <div key={note.id} className={`card note-card ${note.highlight ? 'note-card--highlight' : ''} ${note.pinned ? 'note-card--pinned' : ''}`}>
              <div className="note-card__top">
                {note.pinned && <span className="pin-badge">📌</span>}
                <div className="note-actions">
                  <button className="note-action-btn" onClick={() => toggleHighlight(note.id)} title="Highlight">
                    {note.highlight ? '⭐' : '☆'}
                  </button>
                  <button className="note-action-btn" onClick={() => togglePin(note.id)} title="Pin">
                    {note.pinned ? '📌' : '—'}
                  </button>
                  <button className="note-action-btn note-action-btn--del" onClick={() => deleteNote(note.id)} title="Delete">✕</button>
                </div>
              </div>
              <p className="note-content">{note.content}</p>
              <div className="note-footer">
                <div className="note-tags">
                  {note.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
                </div>
                <span className="note-date">{formatDate(note.date)}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">
              <p>No notes here yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
