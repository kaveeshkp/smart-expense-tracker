import { Link } from 'react-router-dom'
import { HelpCircle, Plus, Settings } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import AddExpenseForm from './AddExpenseForm'

type NavItem = {
  label: string
  icon: ReactNode
  path: string
}

type DashboardSidebarProps = {
  navItems: NavItem[]
  activePath: string
}

export default function DashboardSidebar({ navItems, activePath }: DashboardSidebarProps) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        boxSizing: 'border-box',
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0 16px',
        fontFamily: "'DM Sans', Inter, -apple-system, sans-serif",
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #f1f5f9' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#4f46e5', margin: 0, letterSpacing: '-0.5px' }}>SmartExpenses</h1>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0', fontWeight: '500' }}>Premium Account</p>
      </div>

      <nav style={{ padding: '20px 12px', flex: 1 }}>
        {navItems.map((item) => {
          const active = activePath === item.path

          return (
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
                fontWeight: active ? '600' : '500',
                color: active ? '#4f46e5' : '#64748b',
                background: active ? 'rgba(99,102,241,0.08)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                borderLeft: active ? '3px solid #4f46e5' : '3px solid transparent',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0 12px 12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
        <button
          style={{
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
          }}
          onClick={() => setShowAdd(true)}
        >
          <Plus size={16} /> Add Expense
        </button>

        <Link
          to="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '10px',
            marginBottom: '4px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#64748b',
            textDecoration: 'none',
          }}
        >
          <Settings size={18} />
          Settings
        </Link>

        <Link
          to="/support"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#64748b',
            textDecoration: 'none',
          }}
        >
          <HelpCircle size={18} />
          Support
        </Link>
      </div>
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 10px 30px rgba(2,6,23,0.2)' }}>
            <AddExpenseForm onClose={() => setShowAdd(false)} />
          </div>
        </div>
      )}
    </aside>
  )
}