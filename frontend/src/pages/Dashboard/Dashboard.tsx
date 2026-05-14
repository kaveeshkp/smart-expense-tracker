import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  BarChart2,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Building2,
  Zap,
  Car,
  Utensils,
  Tv2,
  ShoppingBag,
  Coffee,
  Triangle,
  Award,
  ChevronRight,
  CreditCard,
} from 'lucide-react'
import DashboardSidebar from '../../components/DashboardSidebar.tsx'
import DashboardHeader from '../../components/DashboardHeader.tsx'

// ── Types ──────────────────────────────────────────────────────────────────
interface BudgetItem {
  label: string
  icon: React.ReactNode
  spent: number
  limit: number
  color: string
}

interface Transaction {
  id: number
  name: string
  category: string
  date: string
  amount: number
  status: 'completed' | 'processing'
  icon: React.ReactNode
  iconBg: string
}

// ── Data ───────────────────────────────────────────────────────────────────
const budgets: BudgetItem[] = [
  { label: 'Food', icon: <Utensils size={16} />, spent: 3200, limit: 4000, color: '#6366f1' },
  { label: 'Transport', icon: <Car size={16} />, spent: 1800, limit: 2500, color: '#6366f1' },
  { label: 'Bills', icon: <Zap size={16} />, spent: 4500, limit: 5000, color: '#ef4444' },
  { label: 'Entertainment', icon: <Tv2 size={16} />, spent: 1200, limit: 2000, color: '#6366f1' },
]

const transactions: Transaction[] = [
  {
    id: 1,
    name: 'Starbucks Coffee',
    category: 'Food',
    date: '2026-05-12',
    amount: -280,
    status: 'completed',
    icon: <Coffee size={18} />,
    iconBg: 'rgba(99,102,241,0.15)',
  },
  {
    id: 2,
    name: 'Uber Ride',
    category: 'Transport',
    date: '2026-05-11',
    amount: -450,
    status: 'completed',
    icon: <Car size={18} />,
    iconBg: 'rgba(99,102,241,0.15)',
  },
  {
    id: 3,
    name: 'Electricity Bill',
    category: 'Bills',
    date: '2026-05-10',
    amount: -1250,
    status: 'completed',
    icon: <Zap size={18} />,
    iconBg: 'rgba(239,68,68,0.12)',
  },
  {
    id: 4,
    name: 'Amazon Shopping',
    category: 'Shopping',
    date: '2026-05-09',
    amount: -2450,
    status: 'processing',
    icon: <ShoppingBag size={18} />,
    iconBg: 'rgba(99,102,241,0.15)',
  },
]

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
  { label: 'Transactions', icon: <ArrowLeftRight size={18} />, path: '/transactions' },
  { label: 'Budgets', icon: <PieChart size={18} />, path: '/budgets' },
  { label: 'Reports', icon: <BarChart2 size={18} />, path: '/reports' },
]

// ── Component ──────────────────────────────────────────────────────────────
const Dashboard = () => {
  const location = useLocation()
  const [search, setSearch] = useState('')

  const s: Record<string, React.CSSProperties> = {
    // Layout
    shell: {
      display: 'flex',
      minHeight: '100vh',
      background: '#f1f5f9',
      fontFamily: "'DM Sans', Inter, -apple-system, sans-serif",
    },
    // Sidebar
    sidebar: {
      width: '260px',
      minWidth: '260px',
      boxSizing: 'border-box',
      background: '#fff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0 16px',
      position: 'sticky' as const,
      top: 0,
      height: '100vh',
    },
    brand: {
      padding: '0 20px 28px',
      borderBottom: '1px solid #f1f5f9',
    },
    brandName: {
      fontSize: '20px',
      fontWeight: '800',
      color: '#4f46e5',
      margin: 0,
      letterSpacing: '-0.5px',
    },
    brandSub: {
      fontSize: '11px',
      color: '#94a3b8',
      margin: '2px 0 0',
      fontWeight: '500',
    },
    nav: {
      padding: '20px 12px',
      flex: 1,
    },
    navItem: (active: boolean): React.CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '10px',
      marginBottom: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: active ? '600' : '500',
      color: active ? '#4f46e5' : '#64748b',
      background: active ? 'rgba(99,102,241,0.08)' : 'transparent',
      textDecoration: 'none',
      transition: 'all 0.15s ease',
      borderLeft: active ? '3px solid #4f46e5' : '3px solid transparent',
    }),
    navBottom: {
      padding: '0 12px 12px',
      borderTop: '1px solid #f1f5f9',
      paddingTop: '12px',
    },
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%',
      padding: '12px',
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      marginBottom: '12px',
      boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
    },
    // Main
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    },
    // Topbar
    topbar: {
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky' as const,
      top: 0,
      zIndex: 10,
    },
    topbarLeft: {},
    greeting: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
    },
    dateLine: {
      fontSize: '13px',
      color: '#94a3b8',
      margin: '2px 0 0',
    },
    topbarRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 14px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      width: '220px',
    },
    searchInput: {
      border: 'none',
      background: 'transparent',
      outline: 'none',
      fontSize: '13px',
      color: '#334155',
      width: '100%',
      fontFamily: 'inherit',
    },
    iconBtn: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
      position: 'relative' as const,
    },
    notifDot: {
      position: 'absolute' as const,
      top: '6px',
      right: '6px',
      width: '7px',
      height: '7px',
      background: '#ef4444',
      borderRadius: '50%',
      border: '1.5px solid #fff',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: '700',
      fontSize: '13px',
      cursor: 'pointer',
    },
    // Content
    content: {
      padding: '24px 28px',
      flex: 1,
    },
    // Stats row
    statsRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px',
      marginBottom: '20px',
    },
    statCard: (accent?: boolean): React.CSSProperties => ({
      background: accent ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)' : '#fff',
      border: accent ? 'none' : '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px 22px',
      color: accent ? '#fff' : '#0f172a',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    }),
    statLabel: (accent?: boolean): React.CSSProperties => ({
      fontSize: '12px',
      fontWeight: '600',
      color: accent ? 'rgba(255,255,255,0.75)' : '#94a3b8',
      marginBottom: '8px',
      letterSpacing: '0.3px',
      textTransform: 'uppercase' as const,
    }),
    statValue: (accent?: boolean): React.CSSProperties => ({
      fontSize: '28px',
      fontWeight: '800',
      color: accent ? '#fff' : '#0f172a',
      letterSpacing: '-1px',
      lineHeight: 1,
      margin: '0 0 10px',
    }),
    statBadge: (positive: boolean, accent?: boolean): React.CSSProperties => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      background: accent
        ? 'rgba(255,255,255,0.18)'
        : positive
        ? 'rgba(34,197,94,0.1)'
        : 'rgba(239,68,68,0.1)',
      color: accent ? '#fff' : positive ? '#16a34a' : '#dc2626',
    }),
    statIcon: (accent?: boolean): React.CSSProperties => ({
      position: 'absolute' as const,
      top: '18px',
      right: '18px',
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: accent ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: accent ? '#fff' : '#6366f1',
    }),
    // Body grid
    bodyGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: '20px',
    },
    // Budget card
    budgetCard: {
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '22px',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
    },
    adjustLink: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#4f46e5',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    budgetRow: {
      marginBottom: '18px',
    },
    budgetRowTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '7px',
    },
    budgetLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#334155',
    },
    budgetAmt: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#64748b',
    },
    trackBg: {
      height: '7px',
      background: '#f1f5f9',
      borderRadius: '99px',
      overflow: 'hidden' as const,
    },
    trackFill: (pct: number, color: string): React.CSSProperties => ({
      height: '100%',
      width: `${pct}%`,
      background: color,
      borderRadius: '99px',
      transition: 'width 0.6s ease',
    }),
    // Right column
    rightCol: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    alertCard: {
      background: '#fff7f7',
      border: '1px solid #fecaca',
      borderRadius: '14px',
      padding: '16px 18px',
      display: 'flex',
      gap: '12px',
    },
    alertIcon: {
      color: '#ef4444',
      flexShrink: 0,
      marginTop: '1px',
    },
    alertTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#dc2626',
      margin: '0 0 4px',
    },
    alertText: {
      fontSize: '13px',
      color: '#ef4444',
      margin: 0,
      lineHeight: 1.5,
    },
    milestoneCard: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '14px',
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    milestoneIcon: {
      width: '42px',
      height: '42px',
      borderRadius: '12px',
      background: 'rgba(34,197,94,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#16a34a',
      flexShrink: 0,
    },
    milestoneLabel: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#15803d',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const,
      margin: '0 0 3px',
    },
    milestoneTitle: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#14532d',
      margin: '0 0 2px',
    },
    milestoneSub: {
      fontSize: '12px',
      color: '#16a34a',
      margin: 0,
    },
    miniGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    },
    miniCard: {
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '14px',
      padding: '16px',
    },
    miniLabel: {
      fontSize: '11px',
      fontWeight: '600',
      color: '#94a3b8',
      margin: '0 0 6px',
      letterSpacing: '0.3px',
      textTransform: 'uppercase' as const,
    },
    miniValue: {
      fontSize: '20px',
      fontWeight: '800',
      color: '#0f172a',
      margin: 0,
      letterSpacing: '-0.5px',
    },
    largestCard: {
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '14px',
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    // Transactions
    txCard: {
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '22px',
      marginTop: '20px',
    },
    txRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '14px 0',
      borderBottom: '1px solid #f8fafc',
    },
    txIcon: (bg: string): React.CSSProperties => ({
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4f46e5',
      flexShrink: 0,
    }),
    txName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#0f172a',
      margin: '0 0 4px',
    },
    txMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    txCat: {
      fontSize: '11px',
      fontWeight: '600',
      color: '#6366f1',
      background: 'rgba(99,102,241,0.08)',
      padding: '2px 8px',
      borderRadius: '20px',
    },
    txDate: {
      fontSize: '11px',
      color: '#94a3b8',
    },
    txRight: {
      marginLeft: 'auto',
      textAlign: 'right' as const,
    },
    txAmt: (amt: number): React.CSSProperties => ({
      fontSize: '14px',
      fontWeight: '700',
      color: amt < 0 ? '#ef4444' : '#16a34a',
    }),
    txStatus: {
      fontSize: '11px',
      color: '#f59e0b',
      fontWeight: '600',
    },
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div style={s.shell}>
      {/* ── Sidebar ── */}
      <DashboardSidebar navItems={navItems} activePath={location.pathname} />

      {/* ── Main ── */}
      <main style={s.main}>
        {/* Topbar */}
        <DashboardHeader
          title="Welcome back, AREA"
          subtitle={today}
          right={
            <div style={s.topbarRight}>
              <div style={s.searchBox}>
                <Search size={14} color="#94a3b8" />
                <input
                  style={s.searchInput}
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button style={s.iconBtn}>
                <Bell size={18} />
                <span style={s.notifDot} />
              </button>
              <div style={s.avatar}>AR</div>
            </div>
          }
        />

        {/* Content */}
        <div style={s.content}>
          {/* Stats Row */}
          <div style={s.statsRow}>
            {/* Total Balance */}
            <div style={s.statCard()}>
              <div style={s.statIcon()}><Building2 size={18} /></div>
              <p style={s.statLabel()}>Total Balance</p>
              <p style={s.statValue()}>₹45,680</p>
              <span style={s.statBadge(true)}>
                <TrendingUp size={11} /> Safe to spend
              </span>
            </div>

            {/* Monthly Spend */}
            <div style={s.statCard()}>
              <div style={s.statIcon()}><ShoppingCart size={18} /></div>
              <p style={s.statLabel()}>Monthly Spend</p>
              <p style={s.statValue()}>₹12,480</p>
              <span style={s.statBadge(false)}>
                <TrendingDown size={11} /> 5.2% vs last month
              </span>
            </div>

            {/* Savings Rate */}
            <div style={s.statCard(true)}>
              <div style={s.statIcon(true)}><CreditCard size={18} /></div>
              <p style={s.statLabel(true)}>Savings Rate</p>
              <p style={s.statValue(true)}>
                16.8%{' '}
                <span style={{ fontSize: '14px', fontWeight: '500', opacity: 0.75 }}>₹2,520</span>
              </p>
              <span style={s.statBadge(true, true)}>
                Keep it up! You're above target.
              </span>
            </div>
          </div>

          {/* Body Grid */}
          <div style={s.bodyGrid}>
            {/* Budget Status */}
            <div style={s.budgetCard}>
              <div style={s.cardHeader}>
                <h2 style={s.cardTitle}>Budget Status</h2>
                <a style={s.adjustLink}>Adjust Limits</a>
              </div>
              {budgets.map((b) => {
                const pct = Math.round((b.spent / b.limit) * 100)
                return (
                  <div key={b.label} style={s.budgetRow}>
                    <div style={s.budgetRowTop}>
                      <span style={s.budgetLabel}>
                        {b.icon} {b.label}
                      </span>
                      <span style={s.budgetAmt}>
                        ₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div style={s.trackBg}>
                      <div style={s.trackFill(pct, b.color)} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Column */}
            <div style={s.rightCol}>
              {/* Spending Alert */}
              <div style={s.alertCard}>
                <span style={s.alertIcon}><Triangle size={18} /></span>
                <div>
                  <p style={s.alertTitle}>Spending Alert</p>
                  <p style={s.alertText}>
                    You are 83% of your monthly budget. Consider deferring non-essential purchases.
                  </p>
                </div>
              </div>

              {/* Savings Milestone */}
              <div style={s.milestoneCard}>
                <div style={s.milestoneIcon}><Award size={20} /></div>
                <div>
                  <p style={s.milestoneLabel}>Savings Milestone</p>
                  <p style={s.milestoneTitle}>Great Savings!</p>
                  <p style={s.milestoneSub}>You saved ₹2,520 this month</p>
                </div>
              </div>

              {/* Mini Stats */}
              <div style={s.miniGrid}>
                <div style={s.miniCard}>
                  <p style={s.miniLabel}>Year Total</p>
                  <p style={s.miniValue}>₹87,450</p>
                </div>
                <div style={s.miniCard}>
                  <p style={s.miniLabel}>Transactions</p>
                  <p style={s.miniValue}>28</p>
                </div>
              </div>

              {/* Largest Spend */}
              <div style={s.largestCard}>
                <div>
                  <p style={s.miniLabel}>Largest Spend</p>
                  <p style={s.miniValue}>₹2,450</p>
                </div>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                  Electronics store
                </span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div style={s.txCard}>
            <div style={s.cardHeader}>
              <h2 style={s.cardTitle}>Recent Transactions</h2>
              <Link
                to="/transactions"
                style={{ ...s.adjustLink, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {transactions.map((tx, i) => (
              <div
                key={tx.id}
                style={{
                  ...s.txRow,
                  ...(i === transactions.length - 1 ? { borderBottom: 'none', paddingBottom: 0 } : {}),
                }}
              >
                <div style={s.txIcon(tx.iconBg)}>{tx.icon}</div>
                <div>
                  <p style={s.txName}>{tx.name}</p>
                  <div style={s.txMeta}>
                    <span style={s.txCat}>{tx.category}</span>
                    <span style={s.txDate}>{tx.date}</span>
                  </div>
                </div>
                <div style={s.txRight}>
                  {tx.status === 'processing' ? (
                    <p style={s.txStatus}>Processing</p>
                  ) : (
                    <p style={s.txAmt(tx.amount)}>
                      {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard