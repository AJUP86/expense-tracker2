import { apiRequest } from '../lib/api';
import type { Income } from '../types/income';

export async function fetchIncomes(): Promise<Income[]> {
  return apiRequest('/income');
}

export async function createIncome(data: {
  amount: number;
  source: string;
  date?: string;
}): Promise<Income> {
  return apiRequest('/income', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
