import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserContext } from '@/lib/data/current-user';
import { getTransactionHistory } from '@/lib/data/wallet';
import { GlassPanel } from '@/components/ui/glass-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { TransactionRow } from '@/components/dashboard/transaction-row';
import { LedgerFilters } from '@/components/dashboard/ledger-filters';

export const metadata: Metadata = { title: 'Transaction ledger' };

const PAGE_SIZE = 15;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { user, wallet } = await getCurrentUserContext();
  const currency = wallet?.currency ?? 'USD';
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const { rows, count } = await getTransactionHistory(supabase, user.id, {
    status: params.status,
    type: params.type,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-white">Transaction ledger</h2>
        <LedgerFilters />
      </div>

      <GlassPanel className="p-5 md:p-6">
        {rows.length === 0 ? (
          <EmptyState icon="wallet" title="No matching transactions" description="Try clearing your filters." />
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {rows.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} currency={currency} />
            ))}
          </div>
        )}
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={count}
          basePath="/wallet/transactions"
          searchParams={params}
        />
      </GlassPanel>
    </div>
  );
}
