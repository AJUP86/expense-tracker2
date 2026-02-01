import { useState } from 'react';
import { activatePeriod, archivePeriod } from '../services/period.service';
import type { PeriodStatus } from '../types/period';

export default function ClosePeriodButton({
  periodId,
  status,
  onChanged,
}: {
  periodId: string;
  status: PeriodStatus;
  onChanged: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;

    try {
      setLoading(true);

      if (status === 'PLANNING') {
        const confirmed = confirm(
          'Start this period? Budgets and income will be locked.',
        );
        if (!confirmed) return;

        await activatePeriod(periodId);
        onChanged();
        return;
      }

      if (status === 'ACTIVE') {
        const confirmed = confirm(
          'Archive this period? It will become read-only.',
        );
        if (!confirmed) return;

        await archivePeriod(periodId);
        onChanged();
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  const label =
    status === 'PLANNING'
      ? loading
        ? 'Starting...'
        : 'Start period'
      : status === 'ACTIVE'
        ? loading
          ? 'Archiving...'
          : 'Archive period'
        : 'Archived';

  const disabled = loading || status === 'ARCHIVED';

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {label}
    </button>
  );
}
