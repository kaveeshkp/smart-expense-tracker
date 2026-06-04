import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/api';
import type { Category } from '../types';
import toast from 'react-hot-toast';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => API.get('/categories').then(r => r.data),
    staleTime: 5 * 60 * 1000, // Cache for 5 min since categories rarely change
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) =>
      API.post<Category>('/categories', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create category');
    },
  });
}
