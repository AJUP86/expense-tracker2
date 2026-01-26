export interface Expense {
  _id: string;
  userId: string;
  budgetId?: {
    _id: string;
    name: string;
  };
  amount: number;
  paymentMethod: 'cash' | 'credit';
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
