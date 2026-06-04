import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(0, currentPage - 2);
  const end = Math.min(totalPages - 1, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex-gap-sm" style={{ justifyContent: 'center', padding: 'var(--space-lg) 0' }}>
      <button
        className="btn btn-sm btn-ghost"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </button>

      {start > 0 && (
        <>
          <button className="btn btn-sm btn-ghost" onClick={() => onPageChange(0)}>1</button>
          {start > 1 && <span style={{ color: 'var(--color-text-muted)' }}>…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}

      {end < totalPages - 1 && (
        <>
          {end < totalPages - 2 && <span style={{ color: 'var(--color-text-muted)' }}>…</span>}
          <button className="btn btn-sm btn-ghost" onClick={() => onPageChange(totalPages - 1)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="btn btn-sm btn-ghost"
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
