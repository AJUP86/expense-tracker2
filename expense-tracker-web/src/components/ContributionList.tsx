import type { Contribution } from '../types/contribution';

export default function ContributionList({
  contributions,
}: {
  contributions: Contribution[];
}) {
  return (
    <div className="space-y-1">
      <h3 className="font-medium">Income contributions</h3>
      {contributions.map((contribution) => (
        <div key={contribution._id} className="flex justify-between text-sm">
          <span>{contribution.name}</span>
          <span>€{contribution.amount}</span>
        </div>
      ))}
    </div>
  );
}
