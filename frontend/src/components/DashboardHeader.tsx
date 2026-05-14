import type { ReactNode } from 'react'

type DashboardHeaderProps = {
  title: string
  subtitle?: string
  right?: ReactNode
}

export default function DashboardHeader({ title, subtitle, right }: DashboardHeaderProps) {
  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        fontFamily: "'DM Sans', Inter, -apple-system, sans-serif",
      }}
    >
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{title}</h2>
        {subtitle ? (
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '2px 0 0' }}>{subtitle}</p>
        ) : null}
      </div>
      {right ? <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{right}</div> : null}
    </header>
  )
}
