import { apiRequest } from '../lib/api';
import type { Income } from '../types/income';

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

export async function fetchIncomes(periodId: string): Promise<Income[]> {
  const response = await apiRequest<PaginatedResponse<Income>>(
    `/incomes/${periodId}`,
  );
  return response.data;
}

export function createIncome(
  periodId: string,
  data: { name: string; amount: number },
): Promise<Income> {
  return apiRequest<Income>(`/incomes/${periodId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
