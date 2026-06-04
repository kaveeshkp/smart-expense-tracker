import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/api';
import type { RecurringExpense, CreateRecurringExpenseData, UpdateRecurringExpenseData } from '../types';
import toast from 'react-hot-toast';

export function useRecurringExpenses() {
  return useQuery<RecurringExpense[]>({
    queryKey: ['recurring-expenses'],
    queryFn: () => API.get('/recurring-expenses').then(r => r.data),
  });
}

export function useCreateRecurringExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecurringExpenseData) =>
      API.post<RecurringExpense>('/recurring-expenses', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] });
      toast.success('Recurring expense created!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to create recurring expense');
    },
  });
}

export function useUpdateRecurringExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRecurringExpenseData }) =>
      API.put<RecurringExpense>(`/recurring-expenses/${id}`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] });
      toast.success('Recurring expense updated!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to update recurring expense');
    },
  });
}

export function useDeleteRecurringExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => API.delete(`/recurring-expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] });
      toast.success('Recurring expense deleted!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to delete recurring expense');
    },
  });
}
