import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/api';
import type { Budget, BudgetStatus, CreateBudgetData, UpdateBudgetData } from '../types';
import toast from 'react-hot-toast';

export function useBudgets() {
  return useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: () => API.get('/budgets').then(r => r.data),
  });
}

export function useBudgetStatuses() {
  return useQuery<BudgetStatus[]>({
    queryKey: ['analytics', 'budget-status'],
    queryFn: () => API.get('/analytics/budget-status').then(r => r.data),
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBudgetData) =>
      API.post<Budget>('/budgets', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Budget created successfully!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to create budget');
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBudgetData }) =>
      API.put<Budget>(`/budgets/${id}`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Budget updated successfully!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to update budget');
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => API.delete(`/budgets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Budget deleted successfully!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to delete budget');
    },
  });
}
