export type BudgetType = 'fixed' | 'variable';

export interface Budget {
  _id: string;
  userId: string;
  periodId: string;
  name: string;
  type: BudgetType;
  amount: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}
