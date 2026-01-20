import type { Expense } from '../types/expense';

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="space-y-2">
      <h2 className="font-medium">Expenses</h2>

      {expenses.map((e) => (
        <div key={e._id} className="border rounded p-3 bg-white">
          <div className="flex justify-between">
            <span>{e.description || 'Expense'}</span>
            <span>€{e.amount}</span>
          </div>
          <div className="text-xs text-gray-500">
            {e.paymentMethod} · {new Date(e.date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
