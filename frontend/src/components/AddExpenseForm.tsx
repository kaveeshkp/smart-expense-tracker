import { useState, useEffect } from 'react'
import API from '../api/api'

type Props = {
  onClose: () => void
}

export default function AddExpenseForm({ onClose }: Props) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [categories, setCategories] = useState<Array<{id:number,name:string}>>([])
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return alert('Title is required')
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) return alert('Amount must be greater than 0')
    setLoading(true)
    try {
      await API.post('/expenses', {
        title: title.trim(),
        amount: amt,
        date,
        categoryId: categoryId,
        notes: notes || null,
      })
      // notify app to refresh lists
      window.dispatchEvent(new CustomEvent('expense:created'))
      onClose()
      alert('Expense added')
    } catch (err: any) {
      alert(err?.response?.data?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    API.get('/categories')
      .then(res => {
        if (!mounted) return
        setCategories(res.data || [])
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  async function createCategory() {
    const name = prompt('Enter new category name')
    if (!name) return
    try {
      const res = await API.post('/categories', { name })
      const cat = res.data
      setCategories(prev => [...prev, cat])
      setCategoryId(cat.id)
    } catch (err: any) {
      alert(err?.response?.data?.message || String(err))
    }
  }

  return (
    <form onSubmit={submit} style={{ width: 520 }}>
      <h3 style={{ margin: '0 0 12px' }}>Add Expense</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Amount</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Date</label>
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Category</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <option value="">Uncategorized</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button type="button" onClick={createCategory} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff' }}>New</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff' }} disabled={loading}>
          Cancel
        </button>
        <button type="submit" style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff' }} disabled={loading}>
          {loading ? 'Saving...' : 'Add Expense'}
        </button>
      </div>
    </form>
  )
}
