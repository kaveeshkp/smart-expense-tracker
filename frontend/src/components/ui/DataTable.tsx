import React from 'react';
import Loader2 from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: any) => void;
}

export default function DataTable({ columns, data, loading, emptyMessage, onRowClick }: DataTableProps) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // Loading skeleton rows
            [1, 2, 3, 4, 5].map((idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <div className="skeleton" style={{ height: '20px', width: '80%', borderRadius: 'var(--radius-sm)' }} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                <div style={{ color: 'var(--color-text-muted)' }}>
                  {emptyMessage || 'No records found.'}
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr 
                key={item.id || rowIdx} 
                onClick={() => onRowClick && onRowClick(item)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
