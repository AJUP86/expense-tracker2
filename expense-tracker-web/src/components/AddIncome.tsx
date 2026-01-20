import { useState } from 'react';
import { createIncome } from '../services/income.service';

export default function AddIncome({ onCreated }: { onCreated: () => void }) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createIncome({
      amount: Number(amount),
      source,
    });

    setAmount('');
    setSource('');
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm border rounded p-4 bg-white space-y-3"
    >
      <h2 className="font-medium">Add your first income</h2>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />

      <input
        placeholder="Source (e.g. Salary)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />

      <button className="w-full bg-black text-white py-2 rounded">
        Add income
      </button>
    </form>
  );
}
