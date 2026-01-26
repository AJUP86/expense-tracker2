import { useState } from 'react';
import { createExpense } from '../services/expense.service';
import type { Budget } from '../types/budget';

export default function AddExpense({
  budgets,
  onCreated,
}: {
  budgets: Budget[];
  onCreated: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [description, setDescription] = useState('');
  const [budgetId, setBudgetId] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createExpense({
      description,
      amount: Number(amount),
      paymentMethod,
      ...(budgetId && { budgetId }),
    });

    setDescription('');
    setAmount('');
    setBudgetId('');
    onCreated();
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <h2 className="font-medium">Add expense</h2>
      <input
        placeholder="Expense description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <select
        value={budgetId}
        onChange={(e) => setBudgetId(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">No budget</option>
        {budgets.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name} (€{b.remaining})
          </option>
        ))}
      </select>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'credit')}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="cash">Cash</option>
        <option value="credit">Credit</option>
      </select>

      <button className="w-full bg-black text-white py-2 rounded">
        Add expense
      </button>
    </form>
  );
}
