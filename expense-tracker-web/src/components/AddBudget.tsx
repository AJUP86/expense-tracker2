import { useState } from 'react';
import { createBudget } from '../services/budget.service';
import type { BudgetType } from '../types/budget';

export default function AddBudget({ onCreated }: { onCreated: () => void }) {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<BudgetType>('fixed');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const isTemporary = type === 'temporary';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    if (isTemporary) {
      if (!startDate || !endDate) {
        setError('Start date and end date are required for temporary budgets');
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        setError('End date must be after start date');
        return;
      }
    }
    setLoading(true);

    try {
      await createBudget({
        name,
        type,
        amount: parsedAmount,
        ...(isTemporary && {
          startDate,
          endDate,
        }),
      });

      setName('');
      setAmount('');
      setType('fixed');
      setStartDate('');
      setEndDate('');
      onCreated();
      setSuccess('Budget created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to create budget. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm border rounded p-4 bg-white space-y-3"
    >
      <h2 className="font-medium">Add budget</h2>
      {success && <p className="text-sm text-green-600">{success}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input
        placeholder="Budget (e.g. Groceries)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as BudgetType)}
        className="w-full border rounded px-3 py-2"
        required
      >
        <option value="fixed">Fixed</option>
        <option value="temporary">Temporary</option>
      </select>
      {isTemporary && (
        <>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </>
      )}

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Budget'}
      </button>
    </form>
  );
}
