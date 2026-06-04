import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/api';
import type { User, UpdateProfileData, ChangePasswordData } from '../types';
import toast from 'react-hot-toast';

export function useProfile() {
  return useQuery<User>({
    queryKey: ['profile'],
    queryFn: () => API.get('/users/profile').then(r => r.data),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileData) =>
      API.put<User>('/users/profile', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to update profile');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) =>
      API.put('/users/password', data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to change password');
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => API.delete('/users'),
    onSuccess: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.success('Account deleted successfully');
    },
    onError: (error: string) => {
      toast.error(error || 'Failed to delete account');
    },
  });
}
