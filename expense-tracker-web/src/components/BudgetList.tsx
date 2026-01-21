import type { Budget } from '../types/budget';

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString();
}

export default function BudgetList({ budgets }: { budgets: Budget[] }) {
  return (
    <div className="space-y-2">
      <h2 className="font-medium">Budgets</h2>

      {budgets.map((budget) => (
        <div
          key={budget._id}
          className="border rounded p-3 bg-white flex justify-between"
        >
          <div>
            <p className="font-medium">{budget.name}</p>
            <p className="text-sm text-gray-500">
              {budget.type} budget
              {budget.type === 'temporary' &&
                ` From ${formatDate(budget.startDate)} to ${formatDate(budget.endDate)}`}
            </p>
          </div>
          <div className="text-right">
            <p>€{budget.amount}</p>
            <p className="text-sm text-gray-500">
              Remaining: €{budget.remaining}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
