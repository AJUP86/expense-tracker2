import type { Income } from '../types/income';

export default function IncomeList({ incomes }: { incomes: Income[] }) {
  return (
    <div className="space-y-3">
      {incomes.map((income) => (
        <div
          key={income._id}
          className="border rounded p-3 bg-white flex justify-between"
        >
          <div>
            <p className="font-medium">{income.source}</p>
            <p className="text-sm text-gray-500">
              {new Date(income.date).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <p>€{income.amount}</p>
            <p className="text-sm text-gray-500">
              Remaining: €{income.remaining}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
