import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserDetail } from '@/lib/data/admin';
import { GlassPanel } from '@/components/ui/glass-panel';
import { StatusBadge, Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { TransactionRow } from '@/components/dashboard/transaction-row';
import { AdjustmentForm } from '@/components/admin/adjustment-form';
import { SuspendToggle } from '@/components/admin/suspend-toggle';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDateTime } from '@/lib/utils/date';

export const metadata: Metadata = { title: 'Admin · Member detail' };

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { profile, wallet, transactions } = await getUserDetail(supabase, id);

  if (!profile) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{profile.full_name || 'Unnamed member'}</h2>
            {profile.role === 'admin' ? <Badge tone="accent">Admin</Badge> : null}
            <StatusBadge status={profile.status} />
          </div>
          <p className="mt-1 text-sm text-white/45">
            {profile.phone || '—'} · joined {formatDateTime(profile.created_at)}
          </p>
        </div>
        <SuspendToggle userId={profile.id} status={profile.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <GlassPanel className="p-5 md:p-6">
            <p className="text-sm text-white/50">Wallet balance</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {wallet ? formatCurrency(wallet.balance, wallet.currency) : '—'}
            </p>
          </GlassPanel>

          <GlassPanel className="p-5 md:p-6">
            <h3 className="mb-2 text-sm font-semibold text-white">Ledger history</h3>
            {transactions.length === 0 ? (
              <EmptyState icon="wallet" title="No transactions yet" />
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {transactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} currency={wallet?.currency} />
                ))}
              </div>
            )}
          </GlassPanel>
        </div>

        <GlassPanel className="p-5 md:p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Manual adjustment</h3>
          <AdjustmentForm userId={profile.id} />
        </GlassPanel>
      </div>
    </div>
  );
}
