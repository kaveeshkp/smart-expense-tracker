import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Download, Calendar,
  ChevronDown, ArrowUpRight,
} from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────
const monthlyData = [
  { month: 'Dec', income: 65000, expense: 38000 },
  { month: 'Jan', income: 65000, expense: 41000 },
  { month: 'Feb', income: 72000, expense: 36000 },
  { month: 'Mar', income: 65000, expense: 45000 },
  { month: 'Apr', income: 73500, expense: 39000 },
  { month: 'May', income: 73500, expense: 28000 },
]

const categoryData = [
  { category: 'Food',          amount: 3200, budget: 4000, fill: '#6366f1' },
  { category: 'Transport',     amount: 1800, budget: 2500, fill: '#8b5cf6' },
  { category: 'Bills',         amount: 4500, budget: 5000, fill: '#ef4444' },
  { category: 'Entertainment', amount: 1200, budget: 2000, fill: '#f59e0b' },
  { category: 'Health',        amount: 1200, budget: 3000, fill: '#10b981' },
  { category: 'Shopping',      amount: 2450, budget: 5000, fill: '#3b82f6' },
]

const pieData = [
  { name: 'Food',          value: 3200, fill: '#6366f1' },
  { name: 'Transport',     value: 1800, fill: '#8b5cf6' },
  { name: 'Bills',         value: 4500, fill: '#ef4444' },
  { name: 'Entertainment', value: 1200, fill: '#f59e0b' },
  { name: 'Health',        value: 1200, fill: '#10b981' },
  { name: 'Shopping',      value: 2450, fill: '#3b82f6' },
]

const dailySpend = [
  { day: '1', amount: 340 }, { day: '3', amount: 620 }, { day: '5', amount: 280 },
  { day: '7', amount: 1250 }, { day: '9', amount: 450 }, { day: '10', amount: 800 },
  { day: '12', amount: 280 },
]

const totalSpend = pieData.reduce((a, d) => a + d.value, 0)

// ── Custom Tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px',
      padding: '10px 14px', fontSize: '13px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }}>
      <p style={{ fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ margin: '2px 0', color: p.color, fontWeight: '600' }}>
          {p.name}: ₹{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────
export default function Reports() {
  const [period, setPeriod] = useState('May 2026')

  const s: Record<string, React.CSSProperties> = {
    page:    { padding: '28px', background: '#f1f5f9', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" },
    topRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
    heading: { fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' },
    sub:     { fontSize: '13px', color: '#94a3b8', margin: 0 },
    actions: { display: 'flex', gap: '10px' },
    btn:     {
      display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px',
      border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff',
      color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    },
    exportBtn: {
      display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px',
      border: 'none', borderRadius: '10px',
      background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
      color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
    },

    kpiRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' },
    kpiCard: (accent?: string): React.CSSProperties => ({
      background: accent || '#fff', border: '1px solid #e2e8f0',
      borderRadius: '14px', padding: '18px 20px',
    }),
    kpiLabel: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.4px', textTransform: 'uppercase' as const, margin: '0 0 6px' },
    kpiValue: { fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.5px' },
    kpiBadge: (up: boolean): React.CSSProperties => ({
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      fontSize: '12px', fontWeight: '600',
      color: up ? '#16a34a' : '#dc2626',
      background: up ? '#dcfce7' : '#fee2e2',
      padding: '3px 8px', borderRadius: '20px',
    }),

    chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
    chartCard: {
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: '16px', padding: '22px',
    },
    chartTitle: { fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
    chartSub: { fontSize: '12px', color: '#94a3b8', margin: '0 0 20px' },

    fullChart: {
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: '16px', padding: '22px', marginBottom: '16px',
    },

    bottomGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },

    pieRow: { display: 'flex', alignItems: 'center', gap: '20px' },
    legendList: { flex: 1 },
    legendItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' },
    legendLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
    legendDot: (fill: string): React.CSSProperties => ({ width: '10px', height: '10px', borderRadius: '50%', background: fill, flexShrink: 0 }),
    legendName: { fontSize: '13px', color: '#334155', fontWeight: '500' },
    legendPct: { fontSize: '12px', fontWeight: '700', color: '#64748b' },

    insightCard: {
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px',
    },
    insightItem: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: '1px solid #f8fafc',
    },
    insightName: { fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: '0 0 2px' },
    insightSub: { fontSize: '12px', color: '#94a3b8', margin: 0 },
    insightAmt: { fontSize: '14px', fontWeight: '700', color: '#ef4444' },
    insightPct: { fontSize: '11px', color: '#94a3b8', textAlign: 'right' as const, marginTop: '2px' },
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.topRow}>
        <div>
          <h1 style={s.heading}>Reports</h1>
          <p style={s.sub}>Insights and analytics for your finances</p>
        </div>
        <div style={s.actions}>
          <button style={s.btn}><Calendar size={14}/> {period} <ChevronDown size={12}/></button>
          <button style={s.exportBtn}><Download size={14}/> Export PDF</button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={s.kpiRow}>
        <div style={s.kpiCard()}>
          <p style={s.kpiLabel}>Total Income</p>
          <p style={s.kpiValue}>₹73,500</p>
          <span style={s.kpiBadge(true)}><TrendingUp size={11}/> +12.3%</span>
        </div>
        <div style={s.kpiCard()}>
          <p style={s.kpiLabel}>Total Expense</p>
          <p style={{ ...s.kpiValue, color: '#ef4444' }}>₹14,350</p>
          <span style={s.kpiBadge(false)}><TrendingDown size={11}/> +8.1%</span>
        </div>
        <div style={s.kpiCard('#f0fdf4')}>
          <p style={s.kpiLabel}>Net Savings</p>
          <p style={{ ...s.kpiValue, color: '#16a34a' }}>₹59,150</p>
          <span style={s.kpiBadge(true)}><TrendingUp size={11}/> +14.7%</span>
        </div>
        <div style={s.kpiCard()}>
          <p style={s.kpiLabel}>Savings Rate</p>
          <p style={s.kpiValue}>16.8%</p>
          <span style={s.kpiBadge(true)}><ArrowUpRight size={11}/> Above target</span>
        </div>
      </div>

      {/* Income vs Expense Area Chart */}
      <div style={s.fullChart}>
        <p style={s.chartTitle}>Income vs Expenses</p>
        <p style={s.chartSub}>Last 6 months overview</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }}/>
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip content={<CustomTooltip />}/>
            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}/>
            <Area type="monotone" dataKey="income" name="Income" stroke="#6366f1" strokeWidth={2.5} fill="url(#incomeGrad)"/>
            <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2.5} fill="url(#expenseGrad)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two columns: Bar + Pie */}
      <div style={s.chartsGrid}>
        {/* Category Bar Chart */}
        <div style={s.chartCard}>
          <p style={s.chartTitle}>Spending by Category</p>
          <p style={s.chartSub}>Actual vs budget this month</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
              <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<CustomTooltip />}/>
              <Bar dataKey="budget" name="Budget" fill="#e2e8f0" radius={[4,4,0,0]}/>
              <Bar dataKey="amount" name="Spent" radius={[4,4,0,0]}>
                {categoryData.map((entry, index) => <Cell key={index} fill={entry.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={s.chartCard}>
          <p style={s.chartTitle}>Expense Breakdown</p>
          <p style={s.chartSub}>Distribution by category</p>
          <div style={s.pieRow}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, index) => <Cell key={index} fill={entry.fill}/>)}
                </Pie>
                <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, '']}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={s.legendList}>
              {pieData.map(d => (
                <div key={d.name} style={s.legendItem}>
                  <div style={s.legendLeft}>
                    <div style={s.legendDot(d.fill)}/>
                    <span style={s.legendName}>{d.name}</span>
                  </div>
                  <span style={s.legendPct}>{Math.round((d.value / totalSpend) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Daily Spend + Top Categories */}
      <div style={s.bottomGrid}>
        {/* Daily Spend Bar */}
        <div style={s.chartCard}>
          <p style={s.chartTitle}>Daily Spending</p>
          <p style={s.chartSub}>May 2026 — each transaction</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dailySpend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Day', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94a3b8' }}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${v}`}/>
              <Tooltip content={<CustomTooltip />}/>
              <Bar dataKey="amount" name="Spent" fill="#6366f1" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Spending Categories */}
        <div style={s.insightCard}>
          <p style={{ ...s.chartTitle, marginBottom: '4px' }}>Top Categories</p>
          <p style={{ ...s.chartSub, marginBottom: '12px' }}>Highest spend this month</p>
          {[...categoryData].sort((a, b) => b.amount - a.amount).map((c, i) => (
            <div key={c.category} style={{ ...s.insightItem, ...(i === categoryData.length - 1 ? { borderBottom: 'none' } : {}) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: c.fill + '22', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: c.fill,
                }}>{i + 1}</span>
                <div>
                  <p style={s.insightName}>{c.category}</p>
                  <p style={s.insightSub}>Budget: ₹{c.budget.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ ...s.insightAmt, color: c.fill }}>₹{c.amount.toLocaleString()}</p>
                <p style={s.insightPct}>{Math.round((c.amount / c.budget) * 100)}% used</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}