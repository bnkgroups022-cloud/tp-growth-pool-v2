import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserContext } from '@/lib/data/current-user';
import { getRecentTransactions, getBalanceTrend } from '@/lib/data/wallet';
import { getRecentActivity } from '@/lib/data/activity';
import { getBusinessCatalog, getUserBusinessSelectionIds } from '@/lib/data/business';
import { StatTile } from '@/components/ui/stat-tile';
import { GlassPanel } from '@/components/ui/glass-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { WalletTrendChart } from '@/components/dashboard/wallet-trend-chart';
import { TransactionRow } from '@/components/dashboard/transaction-row';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { formatCurrency } from '@/lib/utils/currency';
import { Icon } from '@/components/ui/icon';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { user, wallet } = await getCurrentUserContext();

  const balance = wallet ? Number(wallet.balance) : 0;
  const currency = wallet?.currency ?? 'USD';

  const [transactions, trend, activity, businesses, selectedIds] = await Promise.all([
    getRecentTransactions(supabase, user.id, 5),
    getBalanceTrend(supabase, user.id, balance, 14),
    getRecentActivity(supabase, 8),
    getBusinessCatalog(supabase),
    getUserBusinessSelectionIds(supabase, user.id),
  ]);

  const pendingCount = transactions.filter((t) => t.status === 'pending').length;
  const activeBusiness = businesses.find((b) => selectedIds.has(b.id));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Wallet balance" value={formatCurrency(balance, currency)} icon="wallet" accent />
        <StatTile label="Pending requests" value={pendingCount} icon="clock" />
        <StatTile label="Business" value={activeBusiness ? activeBusiness.name : 'None yet'} icon="briefcase" />
        <StatTile label="Total transactions" value={transactions.length > 0 ? `${transactions.length}+` : 0} icon="trending-up" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <WalletTrendChart data={trend} currency={currency} />

          <GlassPanel className="p-5 md:p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Recent transactions</h3>
              <Link href="/wallet/transactions" className="flex items-center text-xs font-medium text-accent-300 hover:text-accent-200">
                View all <Icon name="chevron-right" className="h-3.5 w-3.5" />
              </Link>
            </div>
            {transactions.length === 0 ? (
              <EmptyState icon="wallet" title="No transactions yet" description="Deposit funds to get started." />
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {transactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} currency={currency} />
                ))}
              </div>
            )}
          </GlassPanel>

          {!activeBusiness ? (
            <GlassPanel className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Choose your first business</h3>
                <p className="mt-1 text-sm text-white/50">Join Trading to start tracking activity in your dashboard.</p>
              </div>
              <Link
                href="/business"
                className="inline-flex h-10 shrink-0 items-center rounded-xl bg-gradient-to-b from-accent-500 to-accent-700 px-4 text-sm font-medium text-white shadow-glow-accent"
              >
                Browse businesses
              </Link>
            </GlassPanel>
          ) : null}
        </div>

        <div className="space-y-6">
          <ActivityFeed initialItems={activity} />
        </div>
      </div>
    </div>
  );
}
