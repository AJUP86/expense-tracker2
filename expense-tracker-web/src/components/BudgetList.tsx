import type { Budget } from '../types/budget';
import type { Expense } from '../types/expense';

interface BudgetListProps {
  budgets: Budget[];
  expenses: Expense[];
}

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString();
}

export default function BudgetList({ budgets, expenses }: BudgetListProps) {
  const uncategorizedExpenses = expenses.filter((e) => !e.budgetId);
  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg">Budget Breakdown</h2>

      {budgets.map((budget) => {
        const budgetExpenses = expenses.filter(
          (e) => e.budgetId?._id === budget._id,
        );

        return (
          <div
            key={budget._id}
            className="border rounded-lg bg-white overflow-hidden shadow-sm"
          >
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">{budget.name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  {budget.type}{' '}
                  {budget.type === 'temporary' &&
                    `(${formatDate(budget.startDate)} - ${formatDate(budget.endDate)})`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold">€{budget.remaining}</p>
                <p className="text-xs text-gray-400">of €{budget.amount}</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {budgetExpenses.length > 0 ? (
                budgetExpenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="p-3 flex justify-between text-sm items-center"
                  >
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">
                        {expense.description}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {formatDate(expense.date)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-red-600">
                        -€{expense.amount}
                      </span>
                      <p className="text-[10px] text-gray-400 capitalize">
                        {expense.paymentMethod}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-gray-400 italic">
                  No expenses yet
                </p>
              )}
            </div>
          </div>
        );
      })}

      {uncategorizedExpenses.length > 0 && (
        <div className="border border-dashed rounded-lg bg-gray-50 overflow-hidden">
          <div className="p-4 border-b border-dashed flex justify-between items-center bg-gray-100">
            <p className="font-bold text-gray-600 italic">Uncategorized</p>
            <p className="text-xs text-gray-500">Manual review needed</p>
          </div>
          <div className="divide-y divide-gray-200">
            {uncategorizedExpenses.map((expense) => (
              <div
                key={expense._id}
                className="p-3 flex justify-between text-sm"
              >
                <span className="text-gray-600">{expense.description}</span>
                <span className="font-medium text-red-600">
                  €{expense.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
