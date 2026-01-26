import { useEffect, useState } from 'react';

import { fetchContributions } from '../services/contribution.service';
import { fetchPeriods } from '../services/period.service';
import { fetchExpenses } from '../services/expense.service';
import { fetchBudgets } from '../services/budget.service';

import type { Contribution } from '../types/contribution';
import type { Period } from '../types/period';
import type { Expense } from '../types/expense';
import type { Budget } from '../types/budget';

import AddPeriod from '../components/AddPeriod';
import PeriodList from '../components/PeriodList';
import AddExpense from '../components/AddExpense';
import ExpenseList from '../components/ExpenseList';
import BudgetList from '../components/BudgetList';
import AddBudget from '../components/AddBudget';
import AddContribution from '../components/AddContribution';
import ContributionList from '../components/ContributionList';

export default function Dashboard() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
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
        const activeIncome = periodData[0];
        const contributionData = await fetchContributions(activeIncome._id);
        setContributions(contributionData);
      } else {
        setContributions([]);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  const hasPeriod = periods.length > 0;
  const hasBudget = budgets.length > 0;

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {!hasPeriod && <AddPeriod onCreated={loadDashboard} />}

      {hasPeriod && (
        <>
          <PeriodList periods={periods} />
          <AddContribution
            incomeId={periods[0]._id}
            onCreated={loadDashboard}
          />
          <ContributionList contributions={contributions} />

          <AddBudget onCreated={loadDashboard} />
          {hasBudget && <BudgetList budgets={budgets} />}

          <AddExpense budgets={budgets} onCreated={loadDashboard} />
          <ExpenseList expenses={expenses} />
        </>
      )}
    </div>
  );
}
