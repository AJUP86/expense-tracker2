export type PeriodStatus = 'PLANNING' | 'ACTIVE' | 'ARCHIVED';

export interface Period {
  _id: string;
  userId: string;
  name: string;
  status: PeriodStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}
