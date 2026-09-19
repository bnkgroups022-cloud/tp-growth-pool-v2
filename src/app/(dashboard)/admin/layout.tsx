import { requireAdminContext } from '@/lib/data/current-user';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Redirects non-admins to /dashboard. This is a UX guard — the real
  // security boundary is the is_admin() RLS policies every admin query
  // and server action goes through regardless of this check.
  await requireAdminContext();

  return <div className="space-y-6">{children}</div>;
}
