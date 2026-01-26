import { apiRequest } from '../lib/api';
import type { Period } from '../types/period';

export async function fetchPeriods(): Promise<Period[]> {
  return apiRequest('/periods');
}

export async function createPeriod(data: {
  amount?: number;
  name: string;
  date?: string;
}): Promise<Period> {
  return apiRequest('/periods', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
