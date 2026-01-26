import { apiRequest } from '../lib/api';
import type { Income } from '../types/income';

export function fetchIncomes(periodId: string): Promise<Income[]> {
  return apiRequest(`/incomes/${periodId}`);
}

export function createIncome(
  periodId: string,
  data: { name: string; amount: number },
): Promise<Income> {
  return apiRequest(`/incomes/${periodId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
