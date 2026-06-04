export interface User {
  userId: number;
  fullName: string;
  email: string;
  preferredCurrency?: string;
  timezone?: string;
  profileImageUrl?: string;
  emailVerified?: boolean;
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  currency: string;
  date: string;
  notes?: string;
  receiptUrl?: string;
  aiCategorized: boolean;
  category?: Category;
  createdAt: string;
}

export interface Budget {
  id: number;
  name: string;
  amount: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate?: string;
  category?: Category;
  createdAt: string;
}

export interface RecurringExpense {
  id: number;
  title: string;
  amount: number;
  currency: string;
  notes?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  nextDueDate: string;
  isActive: boolean;
  category?: Category;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ExpenseSummary {
  totalSpent: number;
  avgDaily: number;
  transactionCount: number;
  monthOverMonthChange: number;
}

export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  totalSpent: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;
  totalSpent: number;
  transactionCount: number;
}

export interface BudgetStatus {
  budgetId: number;
  budgetName: string;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  percentUsed: number;
  period: string;
}

export interface CreateExpenseData {
  title: string;
  amount: number;
  date: string;
  categoryId?: number;
  notes?: string;
  currency?: string;
}

export interface UpdateExpenseData extends CreateExpenseData {}

export interface CreateBudgetData {
  name: string;
  amount: number;
  period: string;
  startDate: string;
  endDate?: string;
  categoryId?: number;
}

export interface UpdateBudgetData extends CreateBudgetData {}

export interface CreateRecurringExpenseData {
  title: string;
  amount: number;
  frequency: string;
  nextDueDate: string;
  categoryId?: number;
  notes?: string;
}

export interface UpdateRecurringExpenseData extends CreateRecurringExpenseData {
  isActive?: boolean;
}

export interface UpdateProfileData {
  fullName: string;
  preferredCurrency?: string;
  timezone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ExpenseFilters {
  page?: number;
  size?: number;
  sort?: string;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}
