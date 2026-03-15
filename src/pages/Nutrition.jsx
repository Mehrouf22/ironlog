import { useState } from 'react'
import './Nutrition.css'
import { DropletIcon, SuppsIcon, MedicalIcon } from '../components/Icons'

// Initial default categories
const DEFAULT_MEALS = { Breakfast: [], Lunch: [], Dinner: [], Snack: [] }



const DEFAULT_GOALS = { kcal: 2400, protein: 160, carbs: 250, fat: 70 }

export default function Nutrition() {
  const [log, setLog] = useState(() => {
    try {
      const saved = localStorage.getItem('il_nutrition_log')
      const today = new Date().toISOString().slice(0, 10)
      const data = saved ? JSON.parse(saved) : null
      if (data && data.date === today && data.log) return data.log
      return DEFAULT_MEALS
    } catch {
      return DEFAULT_MEALS
    }
  })
  const [supps, setSupps] = useState(() => {
    try {
      const saved = localStorage.getItem('il_nutrition_supps')
      const today = new Date().toISOString().slice(0, 10)
      const data = saved ? JSON.parse(saved) : null
      if (data && data.date === today) return data.supps
      return []
    } catch {
      return []
    }
  })
  const [meds, setMeds] = useState(() => {
    try {
      const saved = localStorage.getItem('il_nutrition_meds')
      const today = new Date().toISOString().slice(0, 10)
      const data = saved ? JSON.parse(saved) : null
      if (data && data.date === today) return data.meds
      return []
    } catch {
      return []
    }
  })
  const [newMealName, setNewMealName] = useState('')
  const [water, setWater] = useState(() => {
    try {
      const saved = localStorage.getItem('il_nutrition_water')
      const today = new Date().toISOString().slice(0, 10)
      const data = saved ? JSON.parse(saved) : null
      if (data && data.date === today) return data.water
      return 0
    } catch {
      return 0
    }
  })
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('il_nutrition_goals')
      return saved ? JSON.parse(saved) : DEFAULT_GOALS
    } catch {
      return DEFAULT_GOALS
    }
  })
  const [waterGoal, setWaterGoal] = useState(() => {
    try {
      const saved = localStorage.getItem('il_nutrition_water_goal')
      return saved ? JSON.parse(saved) : 8
    } catch {
      return 8
    }
  })
  const [editingGoals, setEditingGoals] = useState(false)
  const [goalForm, setGoalForm] = useState(goals)
  const [tempWaterGoal, setTempWaterGoal] = useState(waterGoal)
  const [adding, setAdding] = useState(null)
  const [form, setForm] = useState({ name: '', kcal: '', protein: '', carbs: '', fat: '' })
  const [suppForm, setSuppForm] = useState({ name: '', dosage: '' })
  const [medForm, setMedForm] = useState({ name: '', timing: '' })
  const [isAddingSupp, setIsAddingSupp] = useState(false)
  const [isAddingMed, setIsAddingMed] = useState(false)

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
    const newLog = {
      ...log,
      [adding]: [...log[adding], {
        name: form.name,
        kcal: +form.kcal,
        protein: +form.protein || 0,
        carbs: +form.carbs || 0,
        fat: +form.fat || 0,
      }]
    }
    setLog(newLog)
    localStorage.setItem('il_nutrition_log', JSON.stringify({ date: new Date().toISOString().slice(0, 10), log: newLog }))
    
    setForm({ name: '', kcal: '', protein: '', carbs: '', fat: '' })
    setAdding(null)
  }

  function handleSetWater(fn) {
     const newWater = typeof fn === 'function' ? fn(water) : fn
     setWater(newWater)
     localStorage.setItem('il_nutrition_water', JSON.stringify({ date: new Date().toISOString().slice(0, 10), water: newWater }))
  }

  function saveGoals() {
    setGoals(goalForm)
    setWaterGoal(tempWaterGoal)
    localStorage.setItem('il_nutrition_goals', JSON.stringify(goalForm))
    localStorage.setItem('il_nutrition_water_goal', JSON.stringify(tempWaterGoal))
    setEditingGoals(false)
  }

  function removeFood(meal, index) {
    const newMealList = log[meal].filter((_, i) => i !== index)
    const newLog = { ...log, [meal]: newMealList }
    setLog(newLog)
    localStorage.setItem('il_nutrition_log', JSON.stringify({ date: new Date().toISOString().slice(0, 10), log: newLog }))
  }

  function addMealGroup() {
    if (!newMealName.trim()) return
    const categoryName = newMealName.trim()
    if (log[categoryName]) {
      alert("Category already exists!")
      return
    }
    const newLog = { ...log, [categoryName]: [] }
    setLog(newLog)
    localStorage.setItem('il_nutrition_log', JSON.stringify({ date: new Date().toISOString().slice(0, 10), log: newLog }))
    setNewMealName('')
  }

  function addSupp() {
    if (!suppForm.name) return
    const newSupps = [...supps, { name: suppForm.name, dosage: suppForm.dosage, taken: true }]
    setSupps(newSupps)
    localStorage.setItem('il_nutrition_supps', JSON.stringify({ date: new Date().toISOString().slice(0, 10), supps: newSupps }))
    setSuppForm({ name: '', dosage: '' })
    setIsAddingSupp(false)
  }

  function removeSupp(index) {
    const newSupps = supps.filter((_, i) => i !== index)
    setSupps(newSupps)
    localStorage.setItem('il_nutrition_supps', JSON.stringify({ date: new Date().toISOString().slice(0, 10), supps: newSupps }))
  }

  function addMed() {
    if (!medForm.name) return
    const newMeds = [...meds, { name: medForm.name, timing: medForm.timing, taken: false }]
    setMeds(newMeds)
    localStorage.setItem('il_nutrition_meds', JSON.stringify({ date: new Date().toISOString().slice(0, 10), meds: newMeds }))
    setMedForm({ name: '', timing: '' })
    setIsAddingMed(false)
  }

  function toggleMed(index) {
    const newMeds = meds.map((m, i) => i === index ? { ...m, taken: !m.taken } : m)
    setMeds(newMeds)
    localStorage.setItem('il_nutrition_meds', JSON.stringify({ date: new Date().toISOString().slice(0, 10), meds: newMeds }))
  }

  function removeMed(index) {
    const newMeds = meds.filter((_, i) => i !== index)
    setMeds(newMeds)
    localStorage.setItem('il_nutrition_meds', JSON.stringify({ date: new Date().toISOString().slice(0, 10), meds: newMeds }))
  }

  function deleteMealGroup(meal) {
    if (confirm(`Delete the entire "${meal}" group?`)) {
      const newLog = { ...log }
      delete newLog[meal]
      setLog(newLog)
      localStorage.setItem('il_nutrition_log', JSON.stringify({ date: new Date().toISOString().slice(0, 10), log: newLog }))
    }
  }

  function resetNutrition() {
    if (confirm("Are you sure you want to reset today's nutrition?")) {
      setLog(DEFAULT_MEALS)
      setWater(0)
      setSupps([])
      setMeds([])
      localStorage.setItem('il_nutrition_log', JSON.stringify({ date: new Date().toISOString().slice(0, 10), log: DEFAULT_MEALS }))
      localStorage.setItem('il_nutrition_water', JSON.stringify({ date: new Date().toISOString().slice(0, 10), water: 0 }))
      localStorage.setItem('il_nutrition_supps', JSON.stringify({ date: new Date().toISOString().slice(0, 10), supps: [] }))
      localStorage.setItem('il_nutrition_meds', JSON.stringify({ date: new Date().toISOString().slice(0, 10), meds: [] }))
    }
  }

  return (
    <div className="nutrition-page page">
      <div className="container">

        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Nutrition</h1>
            <p style={{ marginTop: '0.5rem' }}>Fuel matters as much as iron.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditingGoals(!editingGoals)}>
              {editingGoals ? 'Cancel Edit' : 'Edit Goals'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={resetNutrition}>Reset Today</button>
          </div>
        </header>

        {editingGoals && (
          <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--bg-elevated)' }}>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Adjust Goals</div>
            <div className="macro-inputs" style={{ marginBottom: '1rem' }}>
              <div>
                <label className="stat-label">Daily Calories</label>
                <input type="number" value={goalForm.kcal} onChange={e => setGoalForm({...goalForm, kcal: +e.target.value})} />
              </div>
              <div>
                <label className="stat-label">Protein (g)</label>
                <input type="number" value={goalForm.protein} onChange={e => setGoalForm({...goalForm, protein: +e.target.value})} />
              </div>
              <div>
                <label className="stat-label">Carbs (g)</label>
                <input type="number" value={goalForm.carbs} onChange={e => setGoalForm({...goalForm, carbs: +e.target.value})} />
              </div>
              <div>
                <label className="stat-label">Fat (g)</label>
                <input type="number" value={goalForm.fat} onChange={e => setGoalForm({...goalForm, fat: +e.target.value})} />
              </div>
              <div>
                <label className="stat-label">Water (cups)</label>
                <input type="number" value={tempWaterGoal} onChange={e => setTempWaterGoal(+e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary btn-full" onClick={saveGoals}>Save Personal Goals</button>
          </div>
        )}

        {/* Macro summary */}
        <div className="card macro-summary">
          <div className="section-label" style={{ marginBottom: '1rem' }}>Today's Macros</div>
          <div className="macro-grid">
            <MacroBar label="Calories" value={totals.kcal} goal={goals.kcal} unit="kcal" />
            <MacroBar label="Protein" value={totals.protein} goal={goals.protein} unit="g" color="#ffffff" />
            <MacroBar label="Carbs" value={totals.carbs} goal={goals.carbs} unit="g" color="#888888" />
            <MacroBar label="Fat" value={totals.fat} goal={goals.fat} unit="g" color="#444444" />
          </div>
        </div>

        <hr className="divider" />

        {/* Water */}
        <div className="card water-card">
          <div className="water-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><DropletIcon /> Water</span>
            <span className="water-count">{water} / {waterGoal} cups</span>
          </div>
          <div className="water-dots">
            {Array.from({ length: waterGoal }).map((_, i) => (
              <button
                key={i}
                className={`water-dot ${i < water ? 'water-dot--filled' : ''}`}
                onClick={() => handleSetWater(i < water ? i : i + 1)}
              />
            ))}
          </div>
          <div className="water-btns">
            <button className="btn btn-ghost btn-sm" onClick={() => handleSetWater(w => Math.max(0, w - 1))}>−</button>
            <button className="btn btn-primary btn-sm" onClick={() => handleSetWater(w => Math.min(waterGoal, w + 1))}>+ Cup</button>
          </div>
        </div>

        <hr className="divider" />

        {/* Meal logs */}
        {Object.keys(log).map(meal => (
          <div key={meal} style={{ marginBottom: '1.5rem' }}>
            <div className="meal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="meal-title">{meal}</h3>
                <button className="btn btn-text btn-sm" style={{ color: 'var(--text-muted)', padding: 0 }} onClick={() => deleteMealGroup(meal)} title="Delete Group">✕</button>
              </div>
              <button className="btn btn-text btn-sm" onClick={() => setAdding(meal)}>+ Add Food</button>
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
                      <button className="btn btn-text btn-sm" style={{ marginLeft: '1rem', color: '#fff', fontSize: '1.2rem', padding: '4px' }} onClick={() => removeFood(meal, i)} title="Remove Product">✕</button>
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

        <div className="card" style={{ marginTop: '2rem', borderStyle: 'dashed' }}>
           <div className="section-label" style={{ marginBottom: '0.5rem' }}>Add New Meal Group</div>
           <div style={{ display: 'flex', gap: '0.5rem' }}>
             <input 
               placeholder="e.g. Pre-workout, Afternoon Tea..." 
               value={newMealName}
               onChange={e => setNewMealName(e.target.value)}
             />
             <button className="btn btn-primary btn-sm" onClick={addMealGroup}>Create</button>
           </div>
        </div>

        <hr className="divider" style={{ margin: '3rem 0' }} />

        {/* Supplements Section */}
        <section className="supps-section" style={{ marginBottom: '3rem' }}>
          <div className="meal-header">
            <h3 className="meal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><SuppsIcon /> Supplements</h3>
            <button className="btn btn-text btn-sm" onClick={() => setIsAddingSupp(!isAddingSupp)}>
              {isAddingSupp ? 'Cancel' : '+ Add Supp'}
            </button>
          </div>

          <div className="food-list">
            {supps.length === 0 ? (
              <p className="meal-empty">No supplements logged today.</p>
            ) : (
              supps.map((supp, i) => (
                <div key={i} className="food-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="check-icon" style={{ opacity: 0.5 }}>✓</span>
                    <span className="food-name">{supp.name}</span>
                  </div>
                  <span className="food-macros">
                    <span>{supp.dosage}</span>
                    <button className="btn btn-text btn-sm" style={{ marginLeft: '1rem', color: '#fff' }} onClick={() => removeSupp(i)}>✕</button>
                  </span>
                </div>
              ))
            )}
          </div>

          {isAddingSupp && (
            <div className="card add-food-form">
              <input placeholder="Supplement name (e.g. Creatine)" value={suppForm.name} onChange={e => setSuppForm({...suppForm, name: e.target.value})} />
              <input placeholder="Dosage (e.g. 5g, 1 scoop)" value={suppForm.dosage} onChange={e => setSuppForm({...suppForm, dosage: e.target.value})} />
              <button className="btn btn-primary btn-full" onClick={addSupp}>Log Supplement</button>
            </div>
          )}
        </section>

        {/* Medicine Section */}
        <section className="meds-section" style={{ marginBottom: '4rem' }}>
          <div className="meal-header">
            <h3 className="meal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MedicalIcon /> Medications</h3>
            <button className="btn btn-text btn-sm" onClick={() => setIsAddingMed(!isAddingMed)}>
              {isAddingMed ? 'Cancel' : '+ Add Med'}
            </button>
          </div>

          <div className="food-list">
            {meds.length === 0 ? (
              <p className="meal-empty">No medications listed.</p>
            ) : (
              meds.map((med, i) => (
                <div key={i} className={`food-row ${med.taken ? 'med-taken' : ''}`} style={{ opacity: med.taken ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <button 
                      className={`check-btn ${med.taken ? 'check-btn--done' : ''}`}
                      onClick={() => toggleMed(i)}
                      style={{ width: '24px', height: '24px', flexShrink: 0, padding: 0 }}
                    >
                      {med.taken ? '✓' : ''}
                    </button>
                    <div>
                      <div className="food-name" style={{ textDecoration: med.taken ? 'line-through' : 'none' }}>{med.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{med.timing}</div>
                    </div>
                  </div>
                  <button className="btn btn-text btn-sm" style={{ color: '#fff' }} onClick={() => removeMed(i)}>✕</button>
                </div>
              ))
            )}
          </div>

          {isAddingMed && (
            <div className="card add-food-form">
              <input placeholder="Medicine name" value={medForm.name} onChange={e => setMedForm({...medForm, name: e.target.value})} />
              <input placeholder="Timing (e.g. Morning, After Lunch)" value={medForm.timing} onChange={e => setMedForm({...medForm, timing: e.target.value})} />
              <button className="btn btn-primary btn-full" onClick={addMed}>Add to Daily List</button>
            </div>
          )}
        </section>

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
