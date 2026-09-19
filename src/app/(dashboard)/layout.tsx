import { getCurrentUserContext } from '@/lib/data/current-user';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Topbar } from '@/components/layout/topbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, wallet } = await getCurrentUserContext();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="flex min-h-dvh">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar wallet={wallet} title={`Welcome back${profile?.full_name ? `, ${profile.full_name}` : ''}`} />
        <main className="flex-1 px-4 pb-24 pt-5 md:px-8 md:pb-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
