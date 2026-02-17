import { apiRequest } from '../lib/api';
import type { Budget, BudgetType } from '../types/budget';

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

export async function fetchBudgets(periodId?: string): Promise<Budget[]> {
  const query = periodId ? `?periodId=${encodeURIComponent(periodId)}` : '';
  const response = await apiRequest<PaginatedResponse<Budget>>(
    `/budgets${query}`,
  );
  return response.data;
}

export async function createBudget(data: {
  name: string;
  type: BudgetType;
  amount: number;
}): Promise<Budget> {
  const budgetName = data.name.trim();

  return apiRequest<Budget>('/budgets', {
    method: 'POST',
    body: JSON.stringify({
      name: budgetName,
      type: data.type,
      amount: data.amount,
    }),
  });
}
