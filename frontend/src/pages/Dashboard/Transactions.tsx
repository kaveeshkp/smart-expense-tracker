import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search, Filter, Download, ArrowUpRight, ArrowDownLeft,
  Coffee, Car, Zap, ShoppingBag, Utensils, Tv2, Heart,
  Briefcase, ChevronDown, X, CheckCircle2, Clock, AlertCircle,
  SlidersHorizontal, Calendar, LayoutDashboard, PieChart, BarChart2, Plus,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import DashboardSidebar from '../../components/DashboardSidebar'

// ── Types ─────────────────────────────────────────────────────────────────
type Status = 'completed' | 'processing' | 'failed'
type TxType = 'expense' | 'income'

interface Transaction {
  id: number
  name: string
  merchant: string
  category: string
  date: string
  amount: number
  type: TxType
  status: Status
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────
const ALL_TX: Transaction[] = [
  { id: 1,  name: 'Starbucks Coffee',    merchant: 'Starbucks',         category: 'Food',          date: '2026-05-12', amount: 280,   type: 'expense', status: 'completed',  icon: <Coffee size={16}/>,     iconBg: '#ede9fe', iconColor: '#6d28d9' },
  { id: 2,  name: 'Uber Ride',           merchant: 'Uber',              category: 'Transport',     date: '2026-05-11', amount: 450,   type: 'expense', status: 'completed',  icon: <Car size={16}/>,        iconBg: '#ede9fe', iconColor: '#6d28d9' },
  { id: 3,  name: 'Electricity Bill',    merchant: 'BESCOM',            category: 'Bills',         date: '2026-05-10', amount: 1250,  type: 'expense', status: 'completed',  icon: <Zap size={16}/>,        iconBg: '#fef3c7', iconColor: '#d97706' },
  { id: 4,  name: 'Amazon Shopping',     merchant: 'Amazon',            category: 'Shopping',      date: '2026-05-09', amount: 2450,  type: 'expense', status: 'processing', icon: <ShoppingBag size={16}/>, iconBg: '#ede9fe', iconColor: '#6d28d9' },
  { id: 5,  name: 'Salary Credit',       merchant: 'Employer Ltd',      category: 'Income',        date: '2026-05-08', amount: 65000, type: 'income',  status: 'completed',  icon: <Briefcase size={16}/>,  iconBg: '#dcfce7', iconColor: '#16a34a' },
  { id: 6,  name: 'Zomato Order',        merchant: 'Zomato',            category: 'Food',          date: '2026-05-07', amount: 620,   type: 'expense', status: 'completed',  icon: <Utensils size={16}/>,   iconBg: '#ede9fe', iconColor: '#6d28d9' },
  { id: 7,  name: 'Netflix Subscription',merchant: 'Netflix',           category: 'Entertainment', date: '2026-05-06', amount: 649,   type: 'expense', status: 'completed',  icon: <Tv2 size={16}/>,        iconBg: '#fee2e2', iconColor: '#dc2626' },
  { id: 8,  name: 'Gym Membership',      merchant: 'FitLife',           category: 'Health',        date: '2026-05-05', amount: 1200,  type: 'expense', status: 'completed',  icon: <Heart size={16}/>,      iconBg: '#fce7f3', iconColor: '#be185d' },
  { id: 9,  name: 'Petrol',             merchant: 'HP Pump',           category: 'Transport',     date: '2026-05-04', amount: 800,   type: 'expense', status: 'completed',  icon: <Car size={16}/>,        iconBg: '#ede9fe', iconColor: '#6d28d9' },
  { id: 10, name: 'Swiggy Instamart',    merchant: 'Swiggy',            category: 'Food',          date: '2026-05-03', amount: 340,   type: 'expense', status: 'failed',     icon: <Utensils size={16}/>,   iconBg: '#ede9fe', iconColor: '#6d28d9' },
  { id: 11, name: 'Water Bill',          merchant: 'BWSSB',             category: 'Bills',         date: '2026-05-02', amount: 380,   type: 'expense', status: 'completed',  icon: <Zap size={16}/>,        iconBg: '#fef3c7', iconColor: '#d97706' },
  { id: 12, name: 'Freelance Payment',   merchant: 'Client XYZ',        category: 'Income',        date: '2026-05-01', amount: 8500,  type: 'income',  status: 'completed',  icon: <Briefcase size={16}/>,  iconBg: '#dcfce7', iconColor: '#16a34a' },
]

const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Income']

const statusMeta: Record<Status, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  completed:  { label: 'Completed',  color: '#16a34a', bg: '#dcfce7', icon: <CheckCircle2 size={12}/> },
  processing: { label: 'Processing', color: '#d97706', bg: '#fef3c7', icon: <Clock size={12}/> },
  failed:     { label: 'Failed',     color: '#dc2626', bg: '#fee2e2', icon: <AlertCircle size={12}/> },
}

// ── Component ─────────────────────────────────────────────────────────────
export default function Transactions() {
  const { user } = useAuth()
  const location = useLocation()
  const [search, setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [typeFilter, setTypeFilter] = useState<'all' | TxType>('all')
  const [showFilters, setShowFilters] = useState(false)

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
    { label: 'Transactions', icon: <ArrowUpRight size={18} />, path: '/transactions' },
    { label: 'Budgets', icon: <PieChart size={18} />, path: '/budgets' },
    { label: 'Reports', icon: <BarChart2 size={18} />, path: '/reports' },
  ]

  const filtered = useMemo(() => {
    return ALL_TX.filter(tx => {
      const matchSearch   = tx.name.toLowerCase().includes(search.toLowerCase()) ||
                            tx.merchant.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'All' || tx.category === category
      const matchType     = typeFilter === 'all' || tx.type === typeFilter
      return matchSearch && matchCategory && matchType
    })
  }, [search, category, typeFilter])

  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const totalIncome  = filtered.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)

  const s: Record<string, React.CSSProperties> = {
    page:    { padding: '28px', background: '#f1f5f9', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" },
    heading: { fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' },
    sub:     { fontSize: '13px', color: '#94a3b8', margin: '0 0 24px' },

    summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' },
    summaryCard: (accent?: string): React.CSSProperties => ({
      background: accent || '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '14px',
      padding: '16px 20px',
    }),
    sumLabel: (light?: boolean): React.CSSProperties => ({
      fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px',
      textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.7)' : '#94a3b8', margin: '0 0 6px',
    }),
    sumValue: (light?: boolean): React.CSSProperties => ({
      fontSize: '22px', fontWeight: '800', color: light ? '#fff' : '#0f172a',
      margin: 0, letterSpacing: '-0.5px',
    }),

    toolbar: {
      display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' as const,
    },
    searchBox: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '9px 14px', background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: '10px', flex: 1, minWidth: '180px',
    },
    searchInput: {
      border: 'none', outline: 'none', background: 'transparent',
      fontSize: '13px', color: '#334155', width: '100%', fontFamily: 'inherit',
    },
    btn: (active?: boolean): React.CSSProperties => ({
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '9px 14px', borderRadius: '10px', border: '1px solid #e2e8f0',
      background: active ? '#4f46e5' : '#fff', color: active ? '#fff' : '#64748b',
      fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' as const,
    }),

    filtersPanel: {
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px',
      padding: '16px 20px', marginBottom: '14px',
      display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' as const,
    },
    filterLabel: { fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.4px', textTransform: 'uppercase' as const },
    chips: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const },
    chip: (active: boolean): React.CSSProperties => ({
      padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
      border: '1px solid', cursor: 'pointer',
      background: active ? '#4f46e5' : 'transparent',
      borderColor: active ? '#4f46e5' : '#e2e8f0',
      color: active ? '#fff' : '#64748b',
    }),

    table: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' as const },
    thead: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#94a3b8',
          letterSpacing: '0.5px', textTransform: 'uppercase' as const, textAlign: 'left' as const },
    tr: (i: number): React.CSSProperties => ({
      borderBottom: '1px solid #f8fafc',
      background: i % 2 === 0 ? '#fff' : '#fafafa',
    }),
    td: { padding: '13px 16px', fontSize: '14px', color: '#334155', verticalAlign: 'middle' as const },

    iconCell: (bg: string, color: string): React.CSSProperties => ({
      width: '34px', height: '34px', borderRadius: '10px',
      background: bg, color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }),
    txName:     { fontWeight: '600', color: '#0f172a', fontSize: '14px', margin: '0 0 2px' },
    txMerchant: { fontSize: '12px', color: '#94a3b8', margin: 0 },
    catBadge:   { padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                  background: 'rgba(99,102,241,0.08)', color: '#4f46e5' },
    statusBadge: (s: Status): React.CSSProperties => ({
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
      background: statusMeta[s].bg, color: statusMeta[s].color,
    }),
    amtExpense: { fontWeight: '700', color: '#ef4444', fontSize: '14px' },
    amtIncome:  { fontWeight: '700', color: '#16a34a', fontSize: '14px' },

    empty: { textAlign: 'center' as const, padding: '48px', color: '#94a3b8', fontSize: '14px' },
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <DashboardSidebar navItems={navItems} activePath={location.pathname} />

      {/* Main Content */}
      <div style={{ flex: 1, padding: '28px', fontFamily: "'DM Sans', sans-serif", overflowY: 'auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Transactions</h1>
      <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px' }}>All your income and expense records in one place</p>

      {/* Summary */}
      <div style={s.summaryRow}>
        <div style={s.summaryCard()}>
          <p style={s.sumLabel()}>Total Transactions</p>
          <p style={s.sumValue()}>{filtered.length}</p>
        </div>
        <div style={s.summaryCard()}>
          <p style={s.sumLabel()}>Total Expense</p>
          <p style={{ ...s.sumValue(), color: '#ef4444' }}>-₹{totalExpense.toLocaleString()}</p>
        </div>
        <div style={s.summaryCard('#f0fdf4')}>
          <p style={s.sumLabel()}>Total Income</p>
          <p style={{ ...s.sumValue(), color: '#16a34a' }}>+₹{totalIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <div style={s.searchBox}>
          <Search size={14} color="#94a3b8"/>
          <input style={s.searchInput} placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)}/>
          {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}><X size={14}/></button>}
        </div>
        <button style={s.btn(showFilters)} onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={14}/> Filters
        </button>
        <button style={s.btn()}>
          <Calendar size={14}/> May 2026 <ChevronDown size={12}/>
        </button>
        <button style={s.btn()}>
          <Download size={14}/> Export
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={s.filtersPanel}>
          <div>
            <p style={s.filterLabel}>Category</p>
            <div style={s.chips}>
              {CATEGORIES.map(c => (
                <button key={c} style={s.chip(category === c)} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <p style={s.filterLabel}>Type</p>
            <div style={s.chips}>
              {(['all','expense','income'] as const).map(t => (
                <button key={t} style={s.chip(typeFilter === t)} onClick={() => setTypeFilter(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={s.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={s.thead}>
            <tr>
              <th style={s.th}>Transaction</th>
              <th style={s.th}>Category</th>
              <th style={s.th}>Date</th>
              <th style={s.th}>Status</th>
              <th style={{ ...s.th, textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={s.empty}>No transactions found</td></tr>
            ) : (
              filtered.map((tx, i) => (
                <tr key={tx.id} style={s.tr(i)}>
                  <td style={s.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={s.iconCell(tx.iconBg, tx.iconColor)}>{tx.icon}</div>
                      <div>
                        <p style={s.txName}>{tx.name}</p>
                        <p style={s.txMerchant}>{tx.merchant}</p>
                      </div>
                    </div>
                  </td>
                  <td style={s.td}><span style={s.catBadge}>{tx.category}</span></td>
                  <td style={{ ...s.td, color: '#64748b', fontSize: '13px' }}>{tx.date}</td>
                  <td style={s.td}>
                    <span style={s.statusBadge(tx.status)}>
                      {statusMeta[tx.status].icon} {statusMeta[tx.status].label}
                    </span>
                  </td>
                  <td style={{ ...s.td, textAlign: 'right' }}>
                    <span style={tx.type === 'income' ? s.amtIncome : s.amtExpense}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  )
}