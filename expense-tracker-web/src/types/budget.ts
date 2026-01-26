export type BudgetType = 'temporary' | 'fixed';

export interface Budget {
  _id: string;
  userId: string;
  name: string;
  type: BudgetType;
  amount: number;
  remaining: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
