import { closePeriod } from '../services/period.service';

export default function ClosePeriodButton({
  periodId,
  onClosed,
}: {
  periodId: string;
  onClosed: () => void;
}) {
  async function handleClose() {
    if (!confirm('Close this period? You will not be able to add income.')) {
      return;
    }

    await closePeriod(periodId);
    onClosed();
  }

  return (
    <button
      onClick={handleClose}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Close period
    </button>
  );
}
