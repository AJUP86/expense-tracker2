import { useState } from 'react';
import { createContribution } from '../services/contribution.service';

export default function AddContribution({
  incomeId,
  onCreated,
}: {
  incomeId: string;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await createContribution(incomeId, {
      name,
      amount: Number(amount),
    });

    setName('');
    setAmount('');
    setLoading(false);
    onCreated();
  }

  return (
    <form className="border p-3 rounded space-y-2" onSubmit={handleSubmit}>
      <input
        placeholder="Contribution (e.g. Salary)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-2 py-1"
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border px-2 py-1"
        required
      />

      <button disabled={loading} className="w-full bg-black text-white py-1">
        {loading ? 'Adding…' : 'Add Contribution'}
      </button>
    </form>
  );
}
