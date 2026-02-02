import { useMemo, useState } from 'react';
import { createPeriod } from '../services/period.service';

export default function AddPeriod({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');

  const getRelativeDate = (monthOffset: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset);
    return date.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getRelativeDate(0));
  const [endDate, setEndDate] = useState(getRelativeDate(1));

  const validationError = useMemo(() => {
    if (name.trim().length === 0) return 'Name is required';
    if (!startDate || !endDate) return 'Start and end dates are required';
    if (new Date(startDate) >= new Date(endDate)) {
      return 'End date must be after start date';
    }
    return null;
  }, [name, startDate, endDate]);

  const isValid = validationError === null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createPeriod({
      name: name,
      startDate,
      endDate,
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

      {validationError && (
        <p className="text-sm text-red-600">{validationError}</p>
      )}

      <input
        placeholder="Name (e.g. February 2026)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded text-sm"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded text-sm"
            required
          />
        </div>
      </div>

      <button
        disabled={!isValid}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        Add period
      </button>
    </form>
  );
}
