import type { Period } from '../types/period';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

function statusLabel(status: Period['status']) {
  if (status === 'PLANNING') return 'Planning';
  if (status === 'ACTIVE') return 'Active';
  return 'Archived';
}

export default function PeriodList({ periods }: { periods: Period[] }) {
  return (
    <div className="space-y-3">
      {periods.map((period) => (
        <div
          key={period._id}
          className="border rounded p-3 bg-white flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{period.name}</p>
            <p className="text-xs text-gray-500">
              {formatDate(period.startDate)} - {formatDate(period.endDate)}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs px-2 py-1 rounded bg-gray-100">
              {statusLabel(period.status)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
