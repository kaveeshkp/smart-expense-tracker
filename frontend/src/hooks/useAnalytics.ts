import { useQuery } from '@tanstack/react-query';
import API from '../api/api';
import type { ExpenseSummary, CategoryBreakdown, MonthlyTrend } from '../types';

export function useAnalyticsOverview(startDate?: string, endDate?: string) {
  return useQuery<ExpenseSummary>({
    queryKey: ['analytics', 'overview', startDate, endDate],
    queryFn: () =>
      API.get('/analytics/overview', {
        params: { startDate, endDate },
      }).then(r => r.data),
  });
}

export function useCategoryBreakdown(startDate?: string, endDate?: string) {
  return useQuery<CategoryBreakdown[]>({
    queryKey: ['analytics', 'by-category', startDate, endDate],
    queryFn: () =>
      API.get('/analytics/by-category', {
        params: { startDate, endDate },
      }).then(r => r.data),
  });
}

export function useMonthlyTrend(months?: number) {
  return useQuery<MonthlyTrend[]>({
    queryKey: ['analytics', 'monthly-trend', months],
    queryFn: () =>
      API.get('/analytics/monthly-trend', {
        params: { months: months || 12 },
      }).then(r => r.data),
  });
}
