import { apiRequest } from '../lib/api';
import type { Expense } from '../types/expense';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function fetchExpenses(periodId?: string): Promise<Expense[]> {
  const query = periodId ? `?periodId=${encodeURIComponent(periodId)}` : '';
  const response = await apiRequest<PaginatedResponse<Expense>>(
    `/expenses${query}`,
  );
  return response.data;
}

export async function createExpense(data: {
  amount: number;
  paymentMethod: 'cash' | 'credit';
  description?: string;
  date?: string;
  budgetId?: string;
}): Promise<Expense> {
  return apiRequest<Expense>('/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
