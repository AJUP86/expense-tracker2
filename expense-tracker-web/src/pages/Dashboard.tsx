import { useEffect, useState } from 'react';

import { fetchIncomes } from '../services/income.service';
import { fetchExpenses } from '../services/expense.service';
import { fetchBudgets } from '../services/budget.service';

import type { Income } from '../types/income';
import type { Expense } from '../types/expense';
import type { Budget } from '../types/budget';

import AddIncome from '../components/AddIncome';
import IncomeList from '../components/IncomeList';
import AddExpense from '../components/AddExpense';
import ExpenseList from '../components/ExpenseList';
import BudgetList from '../components/BudgetList';
import AddBudget from '../components/AddBudget';

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [incomeData, expenseData, budgetData] = await Promise.all([
        fetchIncomes(),
        fetchExpenses(),
        fetchBudgets(),
      ]);
      setIncomes(incomeData);
      setExpenses(expenseData);
      setBudgets(budgetData);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  const hasIncome = incomes.length > 0;
  const hasBudget = budgets.length > 0;

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {!hasIncome && <AddIncome onCreated={loadDashboard} />}

      {hasIncome && (
        <>
          <IncomeList incomes={incomes} />
          <AddBudget onCreated={loadDashboard} />
          {hasBudget && <BudgetList budgets={budgets} />}
          <AddExpense budgets={budgets} onCreated={loadDashboard} />
          <ExpenseList expenses={expenses} />
        </>
      )}
    </div>
  );
}
