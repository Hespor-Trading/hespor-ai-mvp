'use client';

import SyncNowButton from './SyncNowButton';

type Props = {
  userId: string;
  days?: number;
};

export default function TopBar({ userId, days = 30 }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <SyncNowButton userId={userId} days={days} />
    </div>
  );
}
