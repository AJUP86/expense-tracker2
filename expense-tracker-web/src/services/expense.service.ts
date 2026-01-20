import { apiRequest } from '../lib/api';
import type { Expense } from '../types/expense';

export async function fetchExpenses(): Promise<Expense[]> {
  return apiRequest('/expenses');
}

export async function createExpense(data: {
  amount: number;
  paymentMethod: 'cash' | 'credit';
  description?: string;
  date?: string;
}): Promise<Expense> {
  return apiRequest('/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
