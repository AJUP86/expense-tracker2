import { useEffect, useState } from 'react';

import { fetchIncomes } from '../services/income.service';
import { fetchPeriods } from '../services/period.service';
import { fetchExpenses } from '../services/expense.service';
import { fetchBudgets } from '../services/budget.service';

import type { Income } from '../types/income';
import type { Period } from '../types/period';
import type { Expense } from '../types/expense';
import type { Budget } from '../types/budget';

import AddPeriod from '../components/AddPeriod';
import PeriodList from '../components/PeriodList';
import AddExpense from '../components/AddExpense';
import ExpenseList from '../components/ExpenseList';
import BudgetList from '../components/BudgetList';
import AddBudget from '../components/AddBudget';
import AddIncome from '../components/AddIncome';
import IncomeList from '../components/IncomeList';
import ClosePeriodButton from '../components/ClosePeriodButton';

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [periodData, expenseData, budgetData] = await Promise.all([
        fetchPeriods(),
        fetchExpenses(),
        fetchBudgets(),
      ]);

      setPeriods(periodData);
      setExpenses(expenseData);
      setBudgets(budgetData);

      if (periodData.length > 0) {
        const activePeriod = periodData.find((p) => !p.isClosed);
        if (activePeriod) {
          const incomeData = await fetchIncomes(activePeriod._id);
          setIncomes(incomeData);
        } else {
          setIncomes([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  const hasPeriod = periods.length > 0;
  const hasBudget = budgets.length > 0;
  const openPeriod = periods.find((p) => !p.isClosed);
  const closedPeriod = periods.find((p) => p.isClosed);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>

        {openPeriod && (
          <ClosePeriodButton
            periodId={openPeriod._id}
            onClosed={loadDashboard}
          />
        )}
      </div>

      {!hasPeriod && <AddPeriod onCreated={loadDashboard} />}

      {hasPeriod && (
        <>
          <PeriodList periods={periods} />

          {openPeriod && (
            <>
              {hasBudget && (
                <BudgetList budgets={budgets} expenses={expenses} layout="" />
              )}

              <div className="space-y-4 pt-4 border-t">
                <AddIncome
                  periodId={openPeriod._id}
                  onCreated={loadDashboard}
                />
                <IncomeList incomes={incomes} />
                <AddBudget onCreated={loadDashboard} />
              </div>
            </>
          )}
          {closedPeriod && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Column: Input (1/4 width) */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  {' '}
                  {/* Keeps the form visible as you scroll budgets */}
                  <AddExpense budgets={budgets} onCreated={loadDashboard} />
                </div>
              </div>

              {/* Right Columns: Budgets (3/4 width) */}
              <div className="lg:col-span-3">
                {/* We pass a prop to BudgetList to tell it to use a 2-column grid internally */}
                <BudgetList
                  budgets={budgets}
                  expenses={expenses}
                  layout="grid"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
