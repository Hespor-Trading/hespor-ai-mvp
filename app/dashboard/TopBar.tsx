'use client';

import SyncNowButton from './SyncNowButton';

type Props = {
  userId: string;
  days?: number;
  onRefetch?: () => void; // tell page to refresh its widgets
};

export default function TopBar({ userId, days = 30, onRefetch }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <SyncNowButton userId={userId} days={days} onDone={onRefetch} />
    </div>
  );
}
