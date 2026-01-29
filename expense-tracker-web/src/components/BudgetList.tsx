import { useState } from 'react';
import type { Budget } from '../types/budget';
import type { Expense } from '../types/expense';

interface BudgetListProps {
  budgets: Budget[];
  expenses: Expense[];
  layout: string;
}

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString();
}

export default function BudgetList({
  budgets,
  expenses,
  layout,
}: BudgetListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleBudget = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const uncategorizedExpenses = expenses.filter((e) => !e.budgetId);

  const today = new Date();
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const timeRatio = dayOfMonth / daysInMonth;

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg">Budget Breakdown</h2>
      <div
        className={
          layout === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'space-y-4'
        }
      >
        {budgets.map((budget) => {
          const isExpanded = expandedId === budget._id;
          const budgetExpenses = expenses.filter(
            (e) => e.budgetId?._id === budget._id,
          );
          const spent = budget.amount - budget.remaining;
          const spendRatio = spent / budget.amount;

          let healthColor = 'bg-gray-300';
          if (budget.type === 'variable') {
            if (spendRatio <= timeRatio + 0.05) healthColor = 'bg-green-500';
            else if (spendRatio <= timeRatio + 0.15)
              healthColor = 'bg-orange-500';
            else healthColor = 'bg-red-500';
          }

          return (
            <div
              key={budget._id}
              className="border rounded-lg bg-white overflow-hidden shadow-sm h-fit"
            >
              <div
                onClick={() => toggleBudget(budget._id)}
                className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${healthColor} shadow-sm`}
                    title={
                      budget.type === 'variable'
                        ? 'Spending Health'
                        : 'Fixed Expense'
                    }
                  />
                  <div>
                    <p className="font-bold text-gray-900">{budget.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      {budget.type}{' '}
                      {budget.type === 'temporary' &&
                        `(${formatDate(budget.startDate)} - ${formatDate(budget.endDate)})`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm">
                      €{budget.remaining}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      of €{budget.amount}
                    </p>
                  </div>
                  <span
                    className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </div>
              </div>
              {isExpanded && (
                <div className="divide-y divide-gray-100 border-t">
                  {budgetExpenses.length > 0 ? (
                    budgetExpenses.map((expense) => (
                      <div
                        key={expense._id}
                        className="p-3 flex justify-between text-sm items-center hover:bg-gray-50"
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
                    <p className="p-4 text-xs text-gray-400 italic text-center">
                      No expenses yet
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

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
