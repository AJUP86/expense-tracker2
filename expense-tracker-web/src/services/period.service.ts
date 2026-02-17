import { apiRequest } from '../lib/api';
import type { Period } from '../types/period';

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

export async function fetchPeriods(): Promise<Period[]> {
  const response = await apiRequest<PaginatedResponse<Period>>('/periods');
  return response.data;
}

export async function fetchCurrentPeriod(): Promise<Period | null> {
  return apiRequest<Period | null>('/periods/current');
}

export async function createPeriod(data: {
  name: string;
  startDate: string;
  endDate: string;
}): Promise<Period> {
  return apiRequest<Period>('/periods', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function activatePeriod(periodId: string): Promise<Period> {
  return apiRequest<Period>(`/periods/${periodId}/activate`, {
    method: 'POST',
  });
}

export async function archivePeriod(periodId: string): Promise<Period> {
  return apiRequest<Period>(`/periods/${periodId}/archive`, {
    method: 'POST',
  });
}
