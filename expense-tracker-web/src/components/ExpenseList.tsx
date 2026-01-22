import type { Expense } from '../types/expense';

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="space-y-2">
      <h2 className="font-medium">Expenses</h2>

      {expenses.map((expense) => (
        <div key={expense._id} className="border rounded p-3 bg-white">
          <div className="flex justify-between">
            <span>{expense.description || 'Expense'}</span>
            <span>€{expense.amount}</span>
          </div>
          <div className="text-xs text-gray-500">
            {expense.budgetId?.name ?? 'Unassigned'} · {expense.paymentMethod} ·{' '}
            {new Date(expense.date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
