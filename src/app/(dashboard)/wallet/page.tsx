import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserContext } from '@/lib/data/current-user';
import { getRecentTransactions } from '@/lib/data/wallet';
import { GlassPanel } from '@/components/ui/glass-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { TransactionRow } from '@/components/dashboard/transaction-row';
import { WalletActions } from '@/components/dashboard/wallet-actions';
import { Icon } from '@/components/ui/icon';
import { formatCurrency } from '@/lib/utils/currency';

export const metadata: Metadata = { title: 'Wallet' };

export default async function WalletPage() {
  const supabase = await createClient();
  const { user, wallet } = await getCurrentUserContext();
  const balance = wallet ? Number(wallet.balance) : 0;
  const currency = wallet?.currency ?? 'USD';

  const transactions = await getRecentTransactions(supabase, user.id, 6);

  return (
    <div className="space-y-6">
      <GlassPanel className="overflow-hidden p-6">
        <p className="text-sm text-white/50">Available balance</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-white">{formatCurrency(balance, currency)}</p>
        <p className="mt-2 text-xs text-white/35">Wallet currency: {currency}</p>
      </GlassPanel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GlassPanel className="p-5 md:p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Recent transactions</h3>
              <Link href="/wallet/transactions" className="flex items-center text-xs font-medium text-accent-300 hover:text-accent-200">
                Full ledger <Icon name="chevron-right" className="h-3.5 w-3.5" />
              </Link>
            </div>
            {transactions.length === 0 ? (
              <EmptyState icon="wallet" title="No transactions yet" description="Your deposits and withdrawals will show up here." />
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {transactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} currency={currency} />
                ))}
              </div>
            )}
          </GlassPanel>
        </div>

        <WalletActions balance={balance} currency={currency} />
      </div>
    </div>
  );
}
