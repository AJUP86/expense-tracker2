import { apiRequest } from '../lib/api';
import type { Budget, BudgetType } from '../types/budget';

export async function fetchBudgets(): Promise<Budget[]> {
  return apiRequest('/budgets');
}

export async function createBudget(data: {
  name: string;
  type: BudgetType;
  amount: number;
  startDate?: string;
  endDate?: string;
}): Promise<Budget> {
  const result = apiRequest('/budgets', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      type: data.type,
      amount: data.amount,
      ...(data.type === 'temporary' && {
        startDate: data.startDate,
        endDate: data.endDate,
      }),
    }),
  });
  if (!result) {
    throw new Error('Budget creation failed');
  }
  return result;
}
