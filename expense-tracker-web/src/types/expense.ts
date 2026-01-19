export interface Expense {
  _id: string;
  userId: string;
  budgetId?: string;
  amount: number;
  paymentMethod: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
