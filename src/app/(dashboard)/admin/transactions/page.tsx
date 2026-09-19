import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getPendingTransactions } from '@/lib/data/admin';
import { GlassPanel } from '@/components/ui/glass-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { TransactionReviewRow } from '@/components/admin/transaction-review-row';

export const metadata: Metadata = { title: 'Admin · Approvals' };

const PAGE_SIZE = 15;

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const { rows, count } = await getPendingTransactions(supabase, { page, pageSize: PAGE_SIZE });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Pending approvals</h2>
        <p className="mt-1 text-sm text-white/50">Deposits and withdrawals waiting for review, oldest first.</p>
      </div>

      <GlassPanel className="p-5 md:p-6">
        {rows.length === 0 ? (
          <EmptyState icon="list-checks" title="All caught up" description="No pending requests right now." />
        ) : (
          rows.map((tx) => <TransactionReviewRow key={tx.id} tx={tx} member={tx.profiles} />)
        )}
        <Pagination page={page} pageSize={PAGE_SIZE} total={count} basePath="/admin/transactions" searchParams={params} />
      </GlassPanel>
    </div>
  );
}
