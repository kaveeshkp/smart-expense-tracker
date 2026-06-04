import { useState } from 'react';
import { useExpenses, useDeleteExpense } from '../../hooks/useExpenses';
import { useCategories } from '../../hooks/useCategories';
import PageLayout from '../../components/ui/PageLayout';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AddExpenseForm from '../../components/AddExpenseForm';
import type { Expense } from '../../types';
import { format } from 'date-fns';
import { Search, SlidersHorizontal, Download, Edit2, Trash2, Calendar, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Transactions() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('date,desc');
  const [showFilters, setShowFilters] = useState(false);

  // Edit / Delete states
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);

  // Fetch data
  const { data: expensesData, isLoading, isError } = useExpenses({
    page,
    size: 10,
    sort,
    categoryId: categoryId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    search: search.trim() || undefined,
  });

  const { data: categories } = useCategories();
  const deleteExpenseMutation = useDeleteExpense();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteConfirm = () => {
    if (deletingExpenseId) {
      deleteExpenseMutation.mutate(deletingExpenseId, {
        onSuccess: () => {
          setDeletingExpenseId(null);
        },
      });
    }
  };

  const handleExportCSV = () => {
    if (!expensesData?.content || expensesData.content.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const headers = ['ID', 'Date', 'Title', 'Category', 'Amount', 'Currency', 'Notes', 'AI Categorized'];
    const rows = expensesData.content.map(e => [
      e.id,
      e.date,
      `"${e.title.replace(/"/g, '""')}"`,
      e.category?.name || 'Uncategorized',
      e.amount,
      e.currency,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
      e.aiCategorized ? 'Yes' : 'No'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (expense: Expense) => format(new Date(expense.date), 'MMM dd, yyyy'),
    },
    {
      key: 'title',
      label: 'Title',
      render: (expense: Expense) => (
        <div>
          <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{expense.title}</div>
          {expense.notes && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{expense.notes}</div>}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (expense: Expense) => (
        <span 
          className="badge" 
          style={{ 
            backgroundColor: expense.category?.color ? `${expense.category.color}20` : 'rgba(255,255,255,0.05)', 
            color: expense.category?.color || 'var(--color-text-secondary)',
            border: `1px solid ${expense.category?.color || 'transparent'}40`
          }}
        >
          {expense.category?.name || 'Uncategorized'}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (expense: Expense) => (
        <span style={{ fontWeight: 'var(--font-weight-bold)' }}>
          {formatCurrency(expense.amount)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (expense: Expense) => (
        <div className="flex-gap-xs" style={{ justifyContent: 'flex-start' }}>
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={(e) => { e.stopPropagation(); setEditingExpense(expense); }}
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button 
            className="btn btn-ghost btn-sm text-danger" 
            onClick={(e) => { e.stopPropagation(); setDeletingExpenseId(expense.id); }}
            title="Delete"
            style={{ color: 'var(--color-danger)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout title="Transactions">
      {/* Toolbar */}
      <div className="flex-between" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-muted)' }}>
              <Search size={16} />
            </span>
            <input
              className="input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by description..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
          <button 
            className={`btn ${showFilters ? 'btn-secondary' : ''}`} 
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        <div className="flex-gap-sm">
          <button className="btn" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters Expanded */}
      {showFilters && (
        <div className="card animate-fade-in-up" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div className="grid-3" style={{ gap: 'var(--space-md)' }}>
            <div>
              <label className="input-label">Category</label>
              <select 
                className="select" 
                value={categoryId || ''} 
                onChange={(e) => { setCategoryId(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
              >
                <option value="">All Categories</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Start Date</label>
              <input 
                className="input" 
                type="date" 
                value={startDate} 
                onChange={(e) => { setStartDate(e.target.value); setPage(0); }} 
              />
            </div>
            <div>
              <label className="input-label">End Date</label>
              <input 
                className="input" 
                type="date" 
                value={endDate} 
                onChange={(e) => { setEndDate(e.target.value); setPage(0); }} 
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-md)', gap: 'var(--space-sm)' }}>
            <select 
              className="select" 
              style={{ width: 'auto' }}
              value={sort} 
              onChange={(e) => { setSort(e.target.value); setPage(0); }}
            >
              <option value="date,desc">Date: Newest First</option>
              <option value="date,asc">Date: Oldest First</option>
              <option value="amount,desc">Amount: Highest First</option>
              <option value="amount,asc">Amount: Lowest First</option>
            </select>
            
            {(categoryId || startDate || endDate) && (
              <button 
                className="btn btn-ghost" 
                onClick={() => {
                  setCategoryId(undefined);
                  setStartDate('');
                  setEndDate('');
                  setPage(0);
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="card">
        <DataTable
          columns={columns}
          data={expensesData?.content || []}
          loading={isLoading}
          emptyMessage="No transactions found matching your filters."
        />
        
        {expensesData && expensesData.totalPages > 1 && (
          <div style={{ padding: 'var(--space-md)', borderTop: '1px solid var(--color-border)' }}>
            <Pagination
              currentPage={page + 1}
              totalPages={expensesData.totalPages}
              onPageChange={(p) => handlePageChange(p - 1)}
            />
          </div>
        )}
      </div>

      {/* Modals & Dialogs */}
      {editingExpense && (
        <AddExpenseForm
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}

      <ConfirmDialog
        isOpen={deletingExpenseId !== null}
        onClose={() => setDeletingExpenseId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        variant="danger"
      />
    </PageLayout>
  );
}