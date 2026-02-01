import { useState } from 'react';
import { createBudget } from '../services/budget.service';
import type { BudgetType } from '../types/budget';

export default function AddBudget({ onCreated }: { onCreated: () => void }) {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<BudgetType>('fixed');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = Number(amount);

  const validationError = (() => {
    if (name.trim().length === 0) return 'Name is required';
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return 'Amount must be a positive number';
    }
    return null;
  })();

  const isValid = validationError === null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await createBudget({
        name: name.trim(),
        type,
        amount: parsedAmount,
      });

      setName('');
      setAmount('');
      setType('fixed');
      setSuccess('Budget successfully created.');
      onCreated();
    } catch {
      setError('Failed to create budget');
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
      {validationError && (
        <p className="text-sm text-red-600">{validationError}</p>
      )}

      <input
        placeholder="Budget name (e.g. Groceries)"
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
        <option value="variable">Variable</option>
      </select>

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
        disabled={!isValid || loading}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Budget'}
      </button>
    </form>
  );
}
