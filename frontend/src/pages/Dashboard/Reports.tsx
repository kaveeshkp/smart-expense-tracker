import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, PieChart, BarChart2, Plus, Search, Bell, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'


const Reports = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [dateRange, setDateRange] = useState('month')

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/', active: location.pathname === '/' },
    { label: 'Transactions', icon: <ArrowLeftRight size={18} />, path: '/transactions', active: location.pathname === '/transactions' },
    { label: 'Budgets', icon: <PieChart size={18} />, path: '/budgets', active: location.pathname === '/budgets' },
    { label: 'Reports', icon: <BarChart2 size={18} />, path: '/reports', active: location.pathname === '/reports' },
  ]

  const monthlyStats = [
    { month: 'Jan', income: 65000, expense: 38000 },
    { month: 'Feb', income: 72000, expense: 36000 },
    { month: 'Mar', income: 65000, expense: 45000 },
    { month: 'Apr', income: 73500, expense: 39000 },
    { month: 'May', income: 73500, expense: 28000 },
  ]

  const categoryExpenses = [
    { category: 'Food', amount: 3200, budget: 4000, percentage: 80, color: '#6366f1' },
    { category: 'Transport', amount: 1800, budget: 2500, percentage: 72, color: '#8b5cf6' },
    { category: 'Bills', amount: 4500, budget: 5000, percentage: 90, color: '#ef4444' },
    { category: 'Entertainment', amount: 1200, budget: 2000, percentage: 60, color: '#f59e0b' },
    { category: 'Health', amount: 1200, budget: 3000, percentage: 40, color: '#10b981' },
    { category: 'Shopping', amount: 2450, budget: 5000, percentage: 49, color: '#3b82f6' },
  ]

  const totalExpense = categoryExpenses.reduce((sum, cat) => sum + cat.amount, 0)
  const totalBudget = categoryExpenses.reduce((sum, cat) => sum + cat.budget, 0)
  const savingsRate = (((totalBudget - totalExpense) / totalBudget) * 100).toFixed(1)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <div style={{ width: '210px', background: '#fff', borderRight: '1px solid #e2e8f0', padding: '24px 0 16px', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #f1f5f9' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#4f46e5', margin: 0, letterSpacing: '-0.5px' }}>WealthTrack</h1>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0', fontWeight: '500' }}>Premium Account</p>
        </div>

        <nav style={{ padding: '20px 12px', flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '10px',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: item.active ? '600' : '500',
                color: item.active ? '#4f46e5' : '#64748b',
                background: item.active ? 'rgba(99,102,241,0.08)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                borderLeft: item.active ? '3px solid #4f46e5' : '3px solid transparent',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '0 12px 12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
          <button style={{
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
          }}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Financial Reports</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '2px 0 0' }}>{new Date().toLocaleDateString()}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '8px 12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', marginBottom: '8px' }}>Total Income</div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>₹73,500</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '13px', fontWeight: '600' }}>
                <TrendingUp size={16} /> 12% vs last month
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', marginBottom: '8px' }}>Total Expense</div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>₹{totalExpense.toLocaleString()}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '13px', fontWeight: '600' }}>
                <TrendingDown size={16} /> 8% vs last month
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '16px', padding: '20px', color: '#fff' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: '8px' }}>Savings Rate</div>
              <p style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px' }}>{savingsRate}%</p>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>On track this month</div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#0f172a' }}>Monthly Trend</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {monthlyStats.map((stat, i) => (
                <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px', fontWeight: '500' }}>{stat.month}</p>
                  <div style={{ marginBottom: '4px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981' }}>+₹{(stat.income / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#ef4444' }}>-₹{(stat.expense / 1000).toFixed(0)}k</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#0f172a' }}>Expense by Category</h3>
            <div>
              {categoryExpenses.map((cat, i) => (
                <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i !== categoryExpenses.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{cat.category}</span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>₹{cat.amount.toLocaleString()} / ₹{cat.budget.toLocaleString()}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: cat.color,
                        width: `${Math.min(cat.percentage, 100)}%`,
                        transition: 'width 0.3s',
                      }}
                    ></div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0', fontWeight: '500' }}>{cat.percentage}% of budget</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports