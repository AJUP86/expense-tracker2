import { apiRequest } from '../lib/api';
import type { Contribution } from '../types/contribution';

export function fetchContributions(incomeId: string): Promise<Contribution[]> {
  return apiRequest(`/contributions/${incomeId}`);
}

export function createContribution(
  incomeId: string,
  data: { name: string; amount: number },
): Promise<Contribution> {
  return apiRequest(`/contributions/${incomeId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
