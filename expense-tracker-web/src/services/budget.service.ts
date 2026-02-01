import { apiRequest } from '../lib/api';
import type { Budget, BudgetType } from '../types/budget';

export async function fetchBudgets(periodId?: string): Promise<Budget[]> {
  const query = periodId ? `?periodId=${encodeURIComponent(periodId)}` : '';
  return apiRequest(`/budgets${query}`);
}

export async function createBudget(data: {
  name: string;
  type: BudgetType;
  amount: number;
}): Promise<Budget> {
  const budgetName = data.name.trim();

  return apiRequest('/budgets', {
    method: 'POST',
    body: JSON.stringify({
      name: budgetName,
      type: data.type,
      amount: data.amount,
    }),
  });
}
