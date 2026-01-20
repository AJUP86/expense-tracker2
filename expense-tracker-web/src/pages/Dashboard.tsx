import { useEffect, useState } from 'react';
import { fetchIncomes } from '../services/income.service';
import type { Income } from '../types/income';
import AddIncome from '../components/AddIncome';
import IncomeList from '../components/IncomeList';

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncomes();
  }, []);

  async function loadIncomes() {
    try {
      const data = await fetchIncomes();
      setIncomes(data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {incomes.length === 0 ? (
        <AddIncome onCreated={loadIncomes} />
      ) : (
        <IncomeList incomes={incomes} />
      )}
    </div>
  );
}
