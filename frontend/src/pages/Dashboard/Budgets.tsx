import { useState } from 'react';
import { useBudgets, useBudgetStatuses, useCreateBudget, useUpdateBudget, useDeleteBudget } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import PageLayout from '../../components/ui/PageLayout';
import BudgetProgressChart from '../../components/charts/BudgetProgressChart';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { BudgetStatus, Budget } from '../../types';
import { PiggyBank, Plus, Edit2, Trash2, Calendar, Folder } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Budgets() {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudgetId, setDeletingBudgetId] = useState<number | null>(null);

  // Fetch data
  const { data: budgets, isLoading: budgetsLoading } = useBudgets();
  const { data: budgetStatuses, isLoading: statusLoading } = useBudgetStatuses();
  const { data: categories } = useCategories();

  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();

  const isLoading = budgetsLoading || statusLoading;

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingBudgetId(id);
  };

  const handleDeleteConfirm = () => {
    if (deletingBudgetId) {
      deleteBudgetMutation.mutate(deletingBudgetId, {
        onSuccess: () => setDeletingBudgetId(null),
      });
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  // Color code budgets progress bar
  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'danger';
    if (percent >= 75) return 'warning';
    return 'success';
  };

  return (
    <PageLayout
      title="Budgets"
      onAddExpense={() => {}} // Empty or omit to keep layout but handle adding elsewhere
      actions={
        <button className="btn btn-primary" onClick={() => { setEditingBudget(null); setShowForm(true); }}>
          <Plus size={16} /> Create Budget
        </button>
      }
    >
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton" style={{ height: 250, borderRadius: 'var(--radius-lg)' }} />
          <div className="grid-3" style={{ gap: 16 }}>
            {[1, 2, 3].map(n => (
              <div key={n} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          {budgetStatuses && budgetStatuses.length > 0 && (
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <BudgetProgressChart data={budgetStatuses} />
            </div>
          )}

          {/* Budgets Grid */}
          {!budgets || budgets.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <PiggyBank size={32} />
                </div>
                <h3 className="empty-state-title">No active budgets</h3>
                <p className="empty-state-description">Set up a monthly or weekly budget limit to control your expenses.</p>
                <button 
                  className="btn btn-primary" 
                  style={{ marginTop: 'var(--space-md)' }} 
                  onClick={() => { setEditingBudget(null); setShowForm(true); }}
                >
                  Create First Budget
                </button>
              </div>
            </div>
          ) : (
            <div className="grid-3">
              {budgets.map((b) => {
                // Find matching status
                const status = budgetStatuses?.find(s => s.budgetId === b.id);
                const spent = status?.spentAmount || 0;
                const percent = status?.percentUsed || 0;
                
                return (
                  <div key={b.id} className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="card-header" style={{ paddingBottom: 'var(--space-sm)' }}>
                      <div>
                        <h3 className="section-title" style={{ fontSize: '15px' }}>{b.name}</h3>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                          <span className="badge badge-accent" style={{ fontSize: '10px' }}>
                            {b.period}
                          </span>
                          <span 
                            className="badge" 
                            style={{ 
                              fontSize: '10px',
                              backgroundColor: b.category?.color ? `${b.category.color}20` : 'rgba(255,255,255,0.05)', 
                              color: b.category?.color || 'var(--color-text-secondary)'
                            }}
                          >
                            {b.category?.name || 'All Categories'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-gap-xs">
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(b)} title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button 
                          className="btn btn-ghost btn-sm text-danger" 
                          onClick={() => handleDeleteClick(b.id)} 
                          title="Delete"
                          style={{ color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                          <span style={{ fontSize: '20px', fontWeight: 'var(--font-weight-bold)' }}>
                            {formatCurrency(spent)}
                          </span>
                          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                            of {formatCurrency(b.amount)}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginBottom: 14 }}>
                          <div className="progress-bar">
                            <div 
                              className={`progress-fill ${getProgressColor(percent)}`} 
                              style={{ width: `${Math.min(100, percent)}%` }}
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 4 }}>
                            <span>{percent.toFixed(0)}% Used</span>
                            <span>{percent >= 100 ? 'Over limit!' : `${formatCurrency(b.amount - spent)} remaining`}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
                        <Calendar size={12} />
                        <span>Starts: {format(new Date(b.startDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Budget Create / Edit Form Modal */}
      {showForm && (
        <BudgetFormModal
          budget={editingBudget || undefined}
          categories={categories || []}
          onClose={() => setShowForm(false)}
          createMutation={createBudgetMutation}
          updateMutation={updateBudgetMutation}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingBudgetId !== null}
        onClose={() => setDeletingBudgetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Budget"
        message="Are you sure you want to delete this budget limit? This action cannot be undone."
        variant="danger"
      />
    </PageLayout>
  );
}

// ── Budget Form Component ──────────────────────────────────────────────────
interface BudgetFormModalProps {
  budget?: Budget;
  categories: any[];
  onClose: () => void;
  createMutation: any;
  updateMutation: any;
}

function BudgetFormModal({ budget, categories, onClose, createMutation, updateMutation }: BudgetFormModalProps) {
  const isEdit = !!budget;
  const [name, setName] = useState(budget?.name || '');
  const [amount, setAmount] = useState(budget?.amount ? String(budget.amount) : '');
  const [period, setPeriod] = useState(budget?.period || 'MONTHLY');
  const [startDate, setStartDate] = useState(budget?.startDate ? budget.startDate.slice(0,10) : new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(budget?.endDate ? budget.endDate.slice(0,10) : '');
  const [categoryId, setCategoryId] = useState<number | null>(budget?.category?.id || null);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Budget name is required');
    const parsedAmt = parseFloat(amount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) return toast.error('Budget limit must be greater than 0');

    const payload = {
      name: name.trim(),
      amount: parsedAmt,
      period,
      startDate,
      endDate: endDate || undefined,
      categoryId: categoryId || undefined,
    };

    if (isEdit && budget) {
      updateMutation.mutate(
        { id: budget.id, data: payload },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? 'Edit Budget Limit' : 'Create Budget Limit'}
    >
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="name">Budget Name</label>
          <input
            id="name"
            className="input"
            type="text"
            placeholder="e.g. Monthly Dining, Grocery Budget"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="input-label" htmlFor="amount">Limit Amount ($)</label>
            <input
              id="amount"
              className="input"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="period">Period</label>
            <select
              id="period"
              className="select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              disabled={isSaving}
            >
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="category">Category (Optional)</label>
          <select
            id="category"
            className="select"
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
            disabled={isSaving}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="input-label" htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              className="input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="endDate">End Date (Optional)</label>
            <input
              id="endDate"
              className="input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="modal-footer" style={{ padding: 'var(--space-md) 0 0 0', borderTop: 'none' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
}