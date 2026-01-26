import type { Income } from '../types/income';

export default function IncomeList({ incomes }: { incomes: Income[] }) {
  return (
    <div className="space-y-1">
      <h3 className="font-medium">Income</h3>
      {incomes.map((income) => (
        <div key={income._id} className="flex justify-between text-sm">
          <span>{income.name}</span>
          <span>€{income.amount}</span>
        </div>
      ))}
    </div>
  );
}
