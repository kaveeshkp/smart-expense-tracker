import { useState } from 'react';
import { useRecurringExpenses, useCreateRecurringExpense, useUpdateRecurringExpense, useDeleteRecurringExpense } from '../../hooks/useRecurringExpenses';
import { useCategories } from '../../hooks/useCategories';
import PageLayout from '../../components/ui/PageLayout';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { RecurringExpense } from '../../types';
import { Plus, Edit2, Trash2, Calendar, Folder, RefreshCw, Play, Pause, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function RecurringExpenses() {
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RecurringExpense | null>(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState<number | null>(null);

  const { data: templates, isLoading: templatesLoading } = useRecurringExpenses();
  const { data: categories } = useCategories();

  const createMutation = useCreateRecurringExpense();
  const updateMutation = useUpdateRecurringExpense();
  const deleteMutation = useDeleteRecurringExpense();

  const handleEdit = (template: RecurringExpense) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingTemplateId(id);
  };

  const handleDeleteConfirm = () => {
    if (deletingTemplateId) {
      deleteMutation.mutate(deletingTemplateId, {
        onSuccess: () => setDeletingTemplateId(null),
      });
    }
  };

  const handleToggleActive = (template: RecurringExpense) => {
    updateMutation.mutate({
      id: template.id,
      data: {
        title: template.title,
        amount: template.amount,
        frequency: template.frequency,
        nextDueDate: template.nextDueDate,
        categoryId: template.category?.id,
        notes: template.notes,
        isActive: !template.isActive,
      },
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <PageLayout
      title="Recurring Expenses"
      actions={
        <button className="btn btn-primary" onClick={() => { setEditingTemplate(null); setShowForm(true); }}>
          <Plus size={16} /> Add Schedule
        </button>
      }
    >
      {templatesLoading ? (
        <div className="grid-3" style={{ gap: 16 }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : !templates || templates.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <RefreshCw size={32} />
            </div>
            <h3 className="empty-state-title">No recurring schedules</h3>
            <p className="empty-state-description">Schedule subscriptions, bills, or rent payments to log automatically.</p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: 'var(--space-md)' }} 
              onClick={() => { setEditingTemplate(null); setShowForm(true); }}
            >
              Add First Schedule
            </button>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {templates.map((t) => (
            <div 
              key={t.id} 
              className="card animate-fade-in-up" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                opacity: t.isActive ? 1 : 0.65 
              }}
            >
              <div className="card-header" style={{ paddingBottom: 'var(--space-sm)' }}>
                <div>
                  <h3 className="section-title" style={{ fontSize: '15px' }}>{t.title}</h3>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                    <span className="badge badge-accent" style={{ fontSize: '10px' }}>
                      {t.frequency}
                    </span>
                    <span 
                      className="badge" 
                      style={{ 
                        fontSize: '10px',
                        backgroundColor: t.category?.color ? `${t.category.color}20` : 'rgba(255,255,255,0.05)', 
                        color: t.category?.color || 'var(--color-text-secondary)'
                      }}
                    >
                      {t.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                </div>

                <div className="flex-gap-xs">
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => handleToggleActive(t)}
                    title={t.isActive ? 'Pause' : 'Resume'}
                    style={{ color: t.isActive ? 'var(--color-warning)' : 'var(--color-success)' }}
                  >
                    {t.isActive ? <Pause size={13} /> : <Play size={13} />}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(t)} title="Edit">
                    <Edit2 size={13} />
                  </button>
                  <button 
                    className="btn btn-ghost btn-sm text-danger" 
                    onClick={() => handleDeleteClick(t.id)} 
                    title="Delete"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8, gap: 4 }}>
                    <span style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)' }}>
                      {formatCurrency(t.amount)}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      /{t.frequency.toLowerCase().replace('ly', '')}
                    </span>
                  </div>

                  {t.notes && (
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                      {t.notes}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
                  <Clock size={12} />
                  <span>Next Due: {format(new Date(t.nextDueDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Form Modal */}
      {showForm && (
        <RecurringFormModal
          template={editingTemplate || undefined}
          categories={categories || []}
          onClose={() => setShowForm(false)}
          createMutation={createMutation}
          updateMutation={updateMutation}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingTemplateId !== null}
        onClose={() => setDeletingTemplateId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Recurring Schedule"
        message="Are you sure you want to delete this recurring template? No future expenses will be auto-generated from it."
        variant="danger"
      />
    </PageLayout>
  );
}

// ── Recurring Form Component ──────────────────────────────────────────────────
interface RecurringFormModalProps {
  template?: RecurringExpense;
  categories: any[];
  onClose: () => void;
  createMutation: any;
  updateMutation: any;
}

function RecurringFormModal({ template, categories, onClose, createMutation, updateMutation }: RecurringFormModalProps) {
  const isEdit = !!template;
  const [title, setTitle] = useState(template?.title || '');
  const [amount, setAmount] = useState(template?.amount ? String(template.amount) : '');
  const [frequency, setFrequency] = useState(template?.frequency || 'MONTHLY');
  const [nextDueDate, setNextDueDate] = useState(template?.nextDueDate ? template.nextDueDate.slice(0,10) : new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState<number | null>(template?.category?.id || null);
  const [notes, setNotes] = useState(template?.notes || '');

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Description title is required');
    const parsedAmt = parseFloat(amount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) return toast.error('Amount must be greater than 0');

    const payload = {
      title: title.trim(),
      amount: parsedAmt,
      frequency,
      nextDueDate,
      categoryId: categoryId || undefined,
      notes: notes.trim() || undefined,
    };

    if (isEdit && template) {
      updateMutation.mutate(
        { id: template.id, data: { ...payload, isActive: template.isActive } },
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
      title={isEdit ? 'Edit Recurring Schedule' : 'Add Recurring Schedule'}
    >
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="title">Title Description</label>
          <input
            id="title"
            className="input"
            type="text"
            placeholder="e.g. Netflix Subscription, Internet Bill"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="input-label" htmlFor="amount">Amount ($)</label>
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
            <label className="input-label" htmlFor="frequency">Frequency</label>
            <select
              id="frequency"
              className="select"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              disabled={isSaving}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="input-label" htmlFor="category">Category (Optional)</label>
            <select
              id="category"
              className="select"
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              disabled={isSaving}
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="nextDueDate">Next Due Date</label>
            <input
              id="nextDueDate"
              className="input"
              type="date"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            className="textarea"
            placeholder="Add specific details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSaving}
            rows={3}
          />
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
            {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Schedule Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
