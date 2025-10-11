// app/dashboard/page.tsx
import DashboardClient from './page.client';

// TODO: replace this with your real auth/session lookup
async function getUserId(): Promise<string> {
  // Example: if you already expose user id somewhere on server, return it here.
  // For now, throw if not implemented.
  // return (await myAuth()).user.id
  throw new Error('Implement getUserId() to return the logged-in user id');
}

export default async function Page() {
  const userId = await getUserId();
  return <DashboardClient userId={userId} days={30} />;
}
