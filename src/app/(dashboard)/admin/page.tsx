import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getAdminOverviewStats, getPendingTransactions } from '@/lib/data/admin';
import { StatTile } from '@/components/ui/stat-tile';
import { GlassPanel } from '@/components/ui/glass-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { TransactionReviewRow } from '@/components/admin/transaction-review-row';
import { Icon } from '@/components/ui/icon';
import { formatCurrency } from '@/lib/utils/currency';

export const metadata: Metadata = { title: 'Admin overview' };

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const [stats, pending] = await Promise.all([
    getAdminOverviewStats(supabase),
    getPendingTransactions(supabase, { pageSize: 5 }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Admin overview</h2>
        <p className="mt-1 text-sm text-white/50">Platform-wide snapshot for Trading Point staff.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total members" value={stats.totalUsers} icon="users" accent />
        <StatTile label="Pending requests" value={stats.pendingCount} icon="clock" />
        <StatTile label="Total wallet balance" value={formatCurrency(stats.totalBalance)} icon="wallet" />
      </div>

      <GlassPanel className="p-5 md:p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Needs review</h3>
          <Link href="/admin/transactions" className="flex items-center text-xs font-medium text-accent-300 hover:text-accent-200">
            View all <Icon name="chevron-right" className="h-3.5 w-3.5" />
          </Link>
        </div>
        {pending.rows.length === 0 ? (
          <EmptyState icon="list-checks" title="All caught up" description="No pending requests right now." />
        ) : (
          pending.rows.map((tx) => <TransactionReviewRow key={tx.id} tx={tx} member={tx.profiles} />)
        )}
      </GlassPanel>
    </div>
  );
}
