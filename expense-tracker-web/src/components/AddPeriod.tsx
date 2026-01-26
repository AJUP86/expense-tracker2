import { useState } from 'react';
import { createPeriod } from '../services/period.service';

export default function AddPeriod({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createPeriod({
      name: name,
    });

    setName('');
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm border rounded p-4 bg-white space-y-3"
    >
      <h2 className="font-medium">Start a new period</h2>

      <input
        placeholder="Period name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />

      <button className="w-full bg-black text-white py-2 rounded">
        Add period
      </button>
    </form>
  );
}
