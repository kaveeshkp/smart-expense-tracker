import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Plus, Utensils, Car, Zap, Tv2, Heart, ShoppingBag,
  Briefcase, Edit2, Trash2, TrendingUp, AlertTriangle, CheckCircle,
  X, Save, LayoutDashboard, ArrowLeftRight, PieChart, BarChart2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import DashboardSidebar from '../../components/DashboardSidebar'

// ── Types ─────────────────────────────────────────────────────────────────
interface Budget {
  id: number
  category: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  limit: number
  spent: number
  color: string
}

// ── Data ──────────────────────────────────────────────────────────────────
const INITIAL_BUDGETS: Budget[] = [
  { id: 1, category: 'Food',          icon: <Utensils size={18}/>,   iconBg: '#ede9fe', iconColor: '#7c3aed', limit: 4000,  spent: 3200,  color: '#6366f1' },
  { id: 2, category: 'Transport',     icon: <Car size={18}/>,         iconBg: '#ede9fe', iconColor: '#7c3aed', limit: 2500,  spent: 1800,  color: '#6366f1' },
  { id: 3, category: 'Bills',         icon: <Zap size={18}/>,         iconBg: '#fef3c7', iconColor: '#d97706', limit: 5000,  spent: 4500,  color: '#ef4444' },
  { id: 4, category: 'Entertainment', icon: <Tv2 size={18}/>,         iconBg: '#fce7f3', iconColor: '#be185d', limit: 2000,  spent: 1200,  color: '#6366f1' },
  { id: 5, category: 'Health',        icon: <Heart size={18}/>,       iconBg: '#fce7f3', iconColor: '#be185d', limit: 3000,  spent: 1200,  color: '#6366f1' },
  { id: 6, category: 'Shopping',      icon: <ShoppingBag size={18}/>, iconBg: '#ede9fe', iconColor: '#7c3aed', limit: 5000,  spent: 2450,  color: '#6366f1' },
]

const CATEGORY_OPTIONS = ['Food','Transport','Bills','Entertainment','Health','Shopping','Travel','Education','Other']

// ── Helpers ───────────────────────────────────────────────────────────────
function pct(spent: number, limit: number) { return Math.min(100, Math.round((spent / limit) * 100)) }
function barColor(p: number) { return p >= 90 ? '#ef4444' : p >= 75 ? '#f59e0b' : '#6366f1' }
function statusLabel(p: number) {
  if (p >= 90) return { text: 'Critical', color: '#dc2626', bg: '#fee2e2', icon: <AlertTriangle size={12}/> }
  if (p >= 75) return { text: 'Warning',  color: '#d97706', bg: '#fef3c7', icon: <AlertTriangle size={12}/> }
  return { text: 'On Track', color: '#16a34a', bg: '#dcfce7', icon: <CheckCircle size={12}/> }
}

// ── Component ─────────────────────────────────────────────────────────────
export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ category: 'Food', limit: '' })

  const { user } = useAuth()
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
    { label: 'Transactions', icon: <ArrowLeftRight size={18} />, path: '/transactions' },
    { label: 'Budgets', icon: <PieChart size={18} />, path: '/budgets' },
    { label: 'Reports', icon: <BarChart2 size={18} />, path: '/reports' },
  ]

  const totalLimit = budgets.reduce((a, b) => a + b.limit, 0)
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0)
  const overBudget = budgets.filter(b => pct(b.spent, b.limit) >= 90).length

  function openAdd() { setEditId(null); setForm({ category: 'Food', limit: '' }); setShowModal(true) }
  function openEdit(b: Budget) { setEditId(b.id); setForm({ category: b.category, limit: String(b.limit) }); setShowModal(true) }
  function deleteB(id: number) { setBudgets(prev => prev.filter(b => b.id !== id)) }

  function saveForm() {
    if (!form.limit || isNaN(Number(form.limit))) return
    if (editId !== null) {
      setBudgets(prev => prev.map(b => b.id === editId ? { ...b, category: form.category, limit: Number(form.limit) } : b))
    } else {
      const newB: Budget = {
        id: Date.now(), category: form.category,
        icon: <ShoppingBag size={18}/>, iconBg: '#ede9fe', iconColor: '#7c3aed',
        limit: Number(form.limit), spent: 0, color: '#6366f1',
      }
      setBudgets(prev => [...prev, newB])
    }
    setShowModal(false)
  }

  const s: Record<string, React.CSSProperties> = {
    page:    { padding: '28px', background: '#f1f5f9', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", position: 'relative' as const },
    heading: { fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' },
    sub:     { fontSize: '13px', color: '#94a3b8', margin: '0 0 24px' },
    topRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },

    summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' },
    sCard: (accent?: string): React.CSSProperties => ({
      background: accent || '#fff', border: '1px solid #e2e8f0',
      borderRadius: '14px', padding: '16px 18px',
    }),
    sLabel: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.4px', textTransform: 'uppercase' as const, margin: '0 0 6px' },
    sValue: { fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' },

    addBtn: {
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '10px 18px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '14px', fontWeight: '700', cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
    },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '16px' },
    card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px' },

    cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' },
    catWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
    iconBox: (bg: string, color: string): React.CSSProperties => ({
      width: '42px', height: '42px', borderRadius: '12px',
      background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }),
    catName: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 },

    actions: { display: 'flex', gap: '6px' },
    actionBtn: (danger?: boolean): React.CSSProperties => ({
      width: '30px', height: '30px', border: '1px solid #e2e8f0',
      borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer',
      color: danger ? '#ef4444' : '#64748b',
    }),

    amounts: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' },
    spent:   { fontWeight: '700', color: '#0f172a' },
    limit:   { color: '#94a3b8' },

    trackBg: { height: '8px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' as const, marginBottom: '10px' },
    trackFill: (p: number, color: string): React.CSSProperties => ({
      height: '100%', width: `${p}%`, background: color, borderRadius: '99px', transition: 'width 0.5s ease',
    }),

    cardBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    pctText: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
    statusBadge: (color: string, bg: string): React.CSSProperties => ({
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
      color, background: bg,
    }),
    remaining: { fontSize: '11px', color: '#94a3b8', marginTop: '6px' },

    // Modal
    overlay: {
      position: 'fixed' as const, inset: 0, background: 'rgba(15,23,42,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
    },
    modal: {
      background: '#fff', borderRadius: '20px', padding: '28px 32px',
      width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    },
    modalTitle: { fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 20px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' },
    select: {
      width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0',
      borderRadius: '10px', fontSize: '14px', color: '#334155',
      background: '#f8fafc', outline: 'none', fontFamily: 'inherit', marginBottom: '16px',
    },
    input: {
      width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0',
      borderRadius: '10px', fontSize: '14px', color: '#334155',
      background: '#f8fafc', outline: 'none', fontFamily: 'inherit',
      boxSizing: 'border-box' as const, marginBottom: '20px',
    },
    modalActions: { display: 'flex', gap: '10px' },
    cancelBtn: {
      flex: 1, padding: '11px', border: '1px solid #e2e8f0', borderRadius: '10px',
      background: '#f8fafc', fontSize: '14px', fontWeight: '600', color: '#64748b', cursor: 'pointer',
    },
    saveBtn: {
      flex: 1, padding: '11px', border: 'none', borderRadius: '10px',
      background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff',
      fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    },
  }

  return (
    <div style={{ display: 'flex', background: '#f1f5f9', minHeight: '100vh' }}>
      <DashboardSidebar navItems={navItems} activePath={location.pathname} />

      {/* Main Content */}
      <div style={{ flex: 1, padding: '28px', fontFamily: "'DM Sans', sans-serif", overflowY: 'auto' }}>
      <div style={s.topRow}>
        <div>
          <h1 style={s.heading}>Budgets</h1>
          <p style={s.sub}>Track and manage your monthly spending limits</p>
        </div>
        <button style={s.addBtn} onClick={openAdd}><Plus size={16}/> New Budget</button>
      </div>

      {/* Summary */}
      <div style={s.summaryRow}>
        <div style={s.sCard()}>
          <p style={s.sLabel}>Total Budget</p>
          <p style={s.sValue}>₹{totalLimit.toLocaleString()}</p>
        </div>
        <div style={s.sCard()}>
          <p style={s.sLabel}>Total Spent</p>
          <p style={{ ...s.sValue, color: '#ef4444' }}>₹{totalSpent.toLocaleString()}</p>
        </div>
        <div style={s.sCard('#f0fdf4')}>
          <p style={s.sLabel}>Remaining</p>
          <p style={{ ...s.sValue, color: '#16a34a' }}>₹{(totalLimit - totalSpent).toLocaleString()}</p>
        </div>
        <div style={s.sCard(overBudget > 0 ? '#fff7f0' : '#f0fdf4')}>
          <p style={s.sLabel}>Over Budget</p>
          <p style={{ ...s.sValue, color: overBudget > 0 ? '#ef4444' : '#16a34a' }}>{overBudget} {overBudget === 1 ? 'category' : 'categories'}</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={s.grid}>
        {budgets.map(b => {
          const p = pct(b.spent, b.limit)
          const bc = barColor(p)
          const st = statusLabel(p)
          return (
            <div key={b.id} style={s.card}>
              <div style={s.cardTop}>
                <div style={s.catWrap}>
                  <div style={s.iconBox(b.iconBg, b.iconColor)}>{b.icon}</div>
                  <p style={s.catName}>{b.category}</p>
                </div>
                <div style={s.actions}>
                  <button style={s.actionBtn()} onClick={() => openEdit(b)}><Edit2 size={13}/></button>
                  <button style={s.actionBtn(true)} onClick={() => deleteB(b.id)}><Trash2 size={13}/></button>
                </div>
              </div>

              <div style={s.amounts}>
                <span style={s.spent}>₹{b.spent.toLocaleString()} spent</span>
                <span style={s.limit}>of ₹{b.limit.toLocaleString()}</span>
              </div>

              <div style={s.trackBg}>
                <div style={s.trackFill(p, bc)}/>
              </div>

              <div style={s.cardBottom}>
                <span style={s.pctText}>{p}% used</span>
                <span style={s.statusBadge(st.color, st.bg)}>{st.icon} {st.text}</span>
              </div>
              <p style={s.remaining}>₹{Math.max(0, b.limit - b.spent).toLocaleString()} remaining</p>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={s.modalTitle}>{editId !== null ? 'Edit Budget' : 'New Budget'}</h2>
            <label style={s.label}>Category</label>
            <select style={s.select} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
            </select>
            <label style={s.label}>Monthly Limit (₹)</label>
            <input
              style={s.input} type="number" placeholder="e.g. 3000"
              value={form.limit} onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
            />
            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={s.saveBtn} onClick={saveForm}><Save size={14} style={{ marginRight: 6 }}/> Save</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}