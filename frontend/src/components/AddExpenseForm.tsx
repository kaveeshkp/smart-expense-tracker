import React, { useState, useEffect } from 'react';
import { useCategories, useCreateCategory } from '../hooks/useCategories';
import { useCreateExpense, useUpdateExpense } from '../hooks/useExpenses';
import type { Expense } from '../types';
import Modal from './ui/Modal';
import { Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddExpenseFormProps {
  onClose: () => void;
  expense?: Expense; // If provided, the form will act as an "Edit" form
}

export default function AddExpenseForm({ onClose, expense }: AddExpenseFormProps) {
  const isEdit = !!expense;
  
  const [title, setTitle] = useState(expense?.title || '');
  const [amount, setAmount] = useState(expense?.amount ? String(expense.amount) : '');
  const [date, setDate] = useState(expense?.date ? expense.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState<number | null>(expense?.category?.id || null);
  const [notes, setNotes] = useState(expense?.notes || '');

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  
  const createExpenseMutation = useCreateExpense();
  const updateExpenseMutation = useUpdateExpense();

  const isSaving = createExpenseMutation.isPending || updateExpenseMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    const payload = {
      title: title.trim(),
      amount: parsedAmount,
      date,
      categoryId: categoryId || undefined,
      notes: notes.trim() || undefined,
      currency: expense?.currency || 'USD'
    };

    if (isEdit && expense) {
      updateExpenseMutation.mutate(
        { id: expense.id, data: payload },
        {
          onSuccess: () => {
            onClose();
          }
        }
      );
    } else {
      createExpenseMutation.mutate(payload, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  const handleCreateCategory = () => {
    const name = prompt('Enter new category name:');
    if (!name || !name.trim()) return;

    createCategoryMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: (newCat) => {
          setCategoryId(newCat.id);
        }
      }
    );
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={isEdit ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="title">Title</label>
          <input
            id="title"
            className="input"
            type="text"
            placeholder="e.g. Starbucks, Rent, Taxi"
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
            <label className="input-label" htmlFor="date">Date</label>
            <input
              id="date"
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="category">Category</label>
          <div className="flex-gap-sm">
            <select
              id="category"
              className="select"
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              disabled={isSaving || categoriesLoading}
              style={{ flex: 1 }}
            >
              <option value="">Uncategorized (Auto AI Categorize)</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn"
              onClick={handleCreateCategory}
              disabled={isSaving || createCategoryMutation.isPending}
              style={{ padding: '12px' }}
              title="Create New Category"
            >
              {createCategoryMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            className="textarea"
            placeholder="Add additional details..."
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
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Saving...
              </>
            ) : (
              isEdit ? 'Save Changes' : 'Add Expense'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
