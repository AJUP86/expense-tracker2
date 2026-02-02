import { apiRequest } from '../lib/api';
import type { Period } from '../types/period';

export async function fetchPeriods(): Promise<Period[]> {
  return apiRequest('/periods');
}

export async function fetchCurrentPeriod(): Promise<Period | null> {
  return apiRequest('/periods/current');
}

export async function createPeriod(data: {
  name: string;
  startDate: string;
  endDate: string;
}): Promise<Period> {
  return apiRequest('/periods', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function activatePeriod(periodId: string): Promise<Period> {
  return apiRequest(`/periods/${periodId}/activate`, {
    method: 'POST',
  });
}

export async function archivePeriod(periodId: string): Promise<Period> {
  return apiRequest(`/periods/${periodId}/archive`, {
    method: 'POST',
  });
}
