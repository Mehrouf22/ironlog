import { useState } from 'react'
import './Nutrition.css'

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

const DEMO_FOOD = {
  Breakfast: [
    { name: 'Oatmeal', kcal: 300, protein: 10, carbs: 55, fat: 5 },
    { name: 'Eggs (3)', kcal: 210, protein: 18, carbs: 1, fat: 15 },
  ],
  Lunch: [
    { name: 'Chicken Rice', kcal: 520, protein: 44, carbs: 60, fat: 8 },
  ],
  Dinner: [],
  Snack: [{ name: 'Whey Protein', kcal: 120, protein: 25, carbs: 3, fat: 2 }],
}

const GOALS = { kcal: 2400, protein: 160, carbs: 250, fat: 70 }

export default function Nutrition() {
  const [log, setLog] = useState(DEMO_FOOD)
  const [water, setWater] = useState(5)
  const [waterGoal] = useState(8)
  const [adding, setAdding] = useState(null)
  const [form, setForm] = useState({ name: '', kcal: '', protein: '', carbs: '', fat: '' })

  const totals = Object.values(log).flat().reduce(
    (acc, f) => ({
      kcal: acc.kcal + f.kcal,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  )

  function addFood() {
    if (!form.name || !form.kcal) return
    setLog(l => ({
      ...l,
      [adding]: [...l[adding], {
        name: form.name,
        kcal: +form.kcal,
        protein: +form.protein || 0,
        carbs: +form.carbs || 0,
        fat: +form.fat || 0,
      }]
    }))
    setForm({ name: '', kcal: '', protein: '', carbs: '', fat: '' })
    setAdding(null)
  }

  return (
    <div className="nutrition-page page">
      <div className="container">

        <header className="page-header">
          <h1>Nutrition</h1>
          <p style={{ marginTop: '0.5rem' }}>Fuel matters as much as iron.</p>
        </header>

        {/* Macro summary */}
        <div className="card macro-summary">
          <div className="section-label" style={{ marginBottom: '1rem' }}>Today's Macros</div>
          <div className="macro-grid">
            <MacroBar label="Calories" value={totals.kcal} goal={GOALS.kcal} unit="kcal" />
            <MacroBar label="Protein" value={totals.protein} goal={GOALS.protein} unit="g" color="#4caf82" />
            <MacroBar label="Carbs" value={totals.carbs} goal={GOALS.carbs} unit="g" color="#3a9bd5" />
            <MacroBar label="Fat" value={totals.fat} goal={GOALS.fat} unit="g" color="#c9a227" />
          </div>
        </div>

        <hr className="divider" />

        {/* Water */}
        <div className="card water-card">
          <div className="water-header">
            <span>💧 Water</span>
            <span className="water-count">{water} / {waterGoal} cups</span>
          </div>
          <div className="water-dots">
            {Array.from({ length: waterGoal }).map((_, i) => (
              <button
                key={i}
                className={`water-dot ${i < water ? 'water-dot--filled' : ''}`}
                onClick={() => setWater(i < water ? i : i + 1)}
              />
            ))}
          </div>
          <div className="water-btns">
            <button className="btn btn-ghost btn-sm" onClick={() => setWater(w => Math.max(0, w - 1))}>−</button>
            <button className="btn btn-primary btn-sm" onClick={() => setWater(w => Math.min(waterGoal, w + 1))}>+ Cup</button>
          </div>
        </div>

        <hr className="divider" />

        {/* Meal logs */}
        {MEALS.map(meal => (
          <div key={meal} style={{ marginBottom: '1.5rem' }}>
            <div className="meal-header">
              <h3 className="meal-title">{meal}</h3>
              <button className="btn btn-text btn-sm" onClick={() => setAdding(meal)}>+ Add</button>
            </div>

            <div className="food-list">
              {log[meal].length === 0
                ? <p className="meal-empty">Nothing logged yet.</p>
                : log[meal].map((food, i) => (
                  <div key={i} className="food-row">
                    <span className="food-name">{food.name}</span>
                    <span className="food-macros">
                      <span>{food.kcal}kcal</span>
                      <span>{food.protein}g P</span>
                    </span>
                  </div>
                ))
              }
            </div>

            {adding === meal && (
              <div className="card add-food-form">
                <input placeholder="Food name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                <div className="macro-inputs">
                  <input type="number" placeholder="kcal" value={form.kcal} onChange={e => setForm(f => ({...f, kcal: e.target.value}))} />
                  <input type="number" placeholder="protein g" value={form.protein} onChange={e => setForm(f => ({...f, protein: e.target.value}))} />
                  <input type="number" placeholder="carbs g" value={form.carbs} onChange={e => setForm(f => ({...f, carbs: e.target.value}))} />
                  <input type="number" placeholder="fat g" value={form.fat} onChange={e => setForm(f => ({...f, fat: e.target.value}))} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setAdding(null)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={addFood}>Add</button>
                </div>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  )
}

function MacroBar({ label, value, goal, unit, color = 'var(--accent)' }) {
  const pct = Math.min(100, Math.round((value / goal) * 100))
  return (
    <div className="macro-bar-item">
      <div className="macro-bar-label">{label}</div>
      <div className="macro-bar-values">
        <span style={{ color }}>{value}{unit}</span>
        <span className="macro-bar-goal">/{goal}{unit}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
