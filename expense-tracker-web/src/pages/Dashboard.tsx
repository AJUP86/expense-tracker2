import { useEffect, useState } from 'react';

import { fetchIncomes } from '../services/income.service';
import { fetchPeriods, fetchCurrentPeriod } from '../services/period.service';
import { fetchExpenses } from '../services/expense.service';
import { fetchBudgets } from '../services/budget.service';

import type { Income } from '../types/income';
import type { Period } from '../types/period';
import type { Expense } from '../types/expense';
import type { Budget } from '../types/budget';

import AddPeriod from '../components/AddPeriod';
import PeriodList from '../components/PeriodList';
import AddExpense from '../components/AddExpense';
import BudgetList from '../components/BudgetList';
import AddBudget from '../components/AddBudget';
import AddIncome from '../components/AddIncome';
import IncomeList from '../components/IncomeList';
import ClosePeriodButton from '../components/ClosePeriodButton';

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [periodData, current] = await Promise.all([
        fetchPeriods(),
        fetchCurrentPeriod(),
      ]);

      setPeriods(periodData);
      setCurrentPeriod(current);

      if (!current) {
        setIncomes([]);
        setBudgets([]);
        setExpenses([]);
        return;
      }

      const [incomeData, budgetData, expenseData] = await Promise.all([
        fetchIncomes(current._id),
        fetchBudgets(current._id),
        fetchExpenses(current._id),
      ]);

      setIncomes(incomeData);
      setBudgets(budgetData);
      setExpenses(expenseData);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  if (!currentPeriod) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        <AddPeriod onCreated={loadDashboard} />
      </div>
    );
  }

  const isPlanning = currentPeriod.status === 'PLANNING';
  const isActive = currentPeriod.status === 'ACTIVE';
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <ClosePeriodButton
          periodId={currentPeriod._id}
          status={currentPeriod.status}
          onChanged={loadDashboard}
        />
      </div>

      <PeriodList periods={periods} />

      {isPlanning && (
        <>
          {budgets.length > 0 && (
            <BudgetList budgets={budgets} expenses={expenses} layout="" />
          )}

          <div className="space-y-4 pt-4 border-t">
            <AddIncome periodId={currentPeriod._id} onCreated={loadDashboard} />
            <IncomeList incomes={incomes} />
            <AddBudget onCreated={loadDashboard} />
          </div>
        </>
      )}

      {isActive && (
        <>
          {currentPeriod.summary && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded">
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-lg font-semibold">
                  ${currentPeriod.summary.totalIncome.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-lg font-semibold">
                  ${currentPeriod.summary.totalExpenses.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p
                  className={`text-lg font-semibold ${currentPeriod.summary.remainingIncome < 0 ? 'text-red-600' : 'text-green-600'}`}
                >
                  ${currentPeriod.summary.remainingIncome.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                <AddExpense budgets={budgets} onCreated={loadDashboard} />
              </div>
            </div>
            <div className="lg:col-span-3">
              <BudgetList budgets={budgets} expenses={expenses} layout="grid" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
