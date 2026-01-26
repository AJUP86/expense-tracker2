import type { Period } from '../types/period';

export default function PeriodList({ periods }: { periods: Period[] }) {
  return (
    <div className="space-y-3">
      {periods.map((period) => (
        <div
          key={period._id}
          className="border rounded p-3 bg-white flex justify-between"
        >
          <div>
            <p className="font-medium">{period.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(period.date).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <p>€{period.amount > 0 ? period.amount : 0}</p>
            <p className="text-sm text-gray-500">
              Remaining: €{period.remaining}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
