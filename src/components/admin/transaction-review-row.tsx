'use client';

import { useActionState } from 'react';
import { reviewTransaction } from '@/lib/actions/admin';
import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/ui/badge';
import { formatSignedCurrency } from '@/lib/utils/currency';
import { formatDateTime } from '@/lib/utils/date';
import { FieldError } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import type { Profile, WalletTransaction } from '@/lib/types/domain';

const TYPE_LABEL: Record<WalletTransaction['type'], string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  adjustment: 'Adjustment',
};

export function TransactionReviewRow({
  tx,
  member,
}: {
  tx: WalletTransaction;
  member: Pick<Profile, 'phone' | 'full_name'> | null;
}) {
  const [state, formAction, isPending] = useActionState(reviewTransaction, {});

  return (
    <div className="flex flex-col gap-3 border-b border-white/[0.05] py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            tx.direction === 'credit' ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
          )}
        >
          <Icon name={tx.direction === 'credit' ? 'arrow-down-left' : 'arrow-up-right'} className="h-[1.125rem] w-[1.125rem]" />
        </span>
        <div>
          <p className="text-sm font-medium text-white/90">
            {TYPE_LABEL[tx.type]} · {formatSignedCurrency(tx.amount, tx.direction)}
          </p>
          <p className="text-xs text-white/40">
            {member?.full_name || member?.phone || 'Member'} · {formatDateTime(tx.created_at)}
            {tx.method ? ` · ${tx.method}` : ''}
          </p>
          {tx.reference ? <p className="text-xs text-white/30">Ref: {tx.reference}</p> : null}
        </div>
      </div>

      <form action={formAction} className="flex shrink-0 items-center gap-2">
        <input type="hidden" name="transactionId" value={tx.id} />
        <button
          type="submit"
          name="decision"
          value="rejected"
          disabled={isPending}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs font-medium text-white/60 hover:bg-white/[0.06] disabled:opacity-50"
        >
          <Icon name="x" className="h-3.5 w-3.5" /> Reject
        </button>
        <button
          type="submit"
          name="decision"
          value="completed"
          disabled={isPending}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-success/90 px-3 text-xs font-medium text-white hover:bg-success disabled:opacity-50"
        >
          <Icon name="check" className="h-3.5 w-3.5" /> Approve
        </button>
      </form>

      {state.error ? (
        <div className="w-full sm:w-auto">
          <FieldError message={state.error} />
        </div>
      ) : null}

      <div className="sm:hidden">
        <StatusBadge status={tx.status} />
      </div>
    </div>
  );
}
