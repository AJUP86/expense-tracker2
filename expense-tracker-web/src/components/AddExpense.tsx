import { useState } from 'react';
import { createExpense } from '../services/expense.service';

export default function AddExpense({ onCreated }: { onCreated: () => void }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [description, setDescription] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createExpense({
      amount: Number(amount),
      paymentMethod,
      description,
    });

    setAmount('');
    setDescription('');
    onCreated();
  }

  return (
    <form
      className="border rounded p-4 bg-white space-y-3"
      onSubmit={handleSubmit}
    >
      <h2 className="font-medium">Add expense</h2>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />

      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'credit')}
        className="w-full border rounded px-3 py-2"
      >
        <option value="cash">Cash</option>
        <option value="credit">Credit</option>
      </select>

      <input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <button className="w-full bg-black text-white py-2 rounded">
        Add expense
      </button>
    </form>
  );
}
