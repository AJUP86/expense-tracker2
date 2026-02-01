import { apiRequest } from '../lib/api';
import type { Expense } from '../types/expense';

export async function fetchExpenses(periodId?: string): Promise<Expense[]> {
  const query = periodId ? `?periodId=${encodeURIComponent(periodId)}` : '';
  return apiRequest(`/expenses${query}`);
}

export async function createExpense(data: {
  amount: number;
  paymentMethod: 'cash' | 'credit';
  description?: string;
  date?: string;
  budgetId?: string;
}): Promise<Expense> {
  return apiRequest('/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
