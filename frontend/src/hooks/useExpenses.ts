import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/api';
import type { Expense, PaginatedResponse, CreateExpenseData, UpdateExpenseData, ExpenseFilters } from '../types';
import toast from 'react-hot-toast';

export function useExpenses(params?: ExpenseFilters) {
  return useQuery<PaginatedResponse<Expense>>({
    queryKey: ['expenses', params],
    queryFn: () => API.get('/expenses', { params }).then(r => r.data),
  });
}

export function useExpense(id: number) {
  return useQuery<Expense>({
    queryKey: ['expenses', id],
    queryFn: () => API.get(`/expenses/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExpenseData) =>
      API.post<Expense>('/expenses', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Expense added successfully!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to add expense');
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExpenseData }) =>
      API.put<Expense>(`/expenses/${id}`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Expense updated successfully!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to update expense');
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => API.delete(`/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Expense deleted successfully!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to delete expense');
    },
  });
}
