export interface Expense {
  _id: string;
  userId: string;
  budgetId?: string;
  amount: number;
  paymentMethod: 'cash' | 'credit';
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
