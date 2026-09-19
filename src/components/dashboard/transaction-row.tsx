import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/ui/badge';
import { formatSignedCurrency } from '@/lib/utils/currency';
import { formatDateTime } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';
import type { WalletTransaction } from '@/lib/types/domain';

const METHOD_LABEL: Record<string, string> = {
  bank_transfer: 'Bank transfer',
  card: 'Card',
  upi: 'UPI',
  crypto: 'Crypto',
};

const TYPE_LABEL: Record<WalletTransaction['type'], string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  adjustment: 'Adjustment',
};

export function TransactionRow({ tx, currency }: { tx: WalletTransaction; currency?: string }) {
  const isCredit = tx.direction === 'credit';

  return (
    <div className="flex items-center gap-3 rounded-xl px-1.5 py-3 transition-colors hover:bg-white/[0.03]">
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          isCredit ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
        )}
      >
        <Icon name={isCredit ? 'arrow-down-left' : 'arrow-up-right'} className="h-[1.125rem] w-[1.125rem]" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/90">
          {TYPE_LABEL[tx.type]}
          {tx.method ? ` · ${METHOD_LABEL[tx.method] ?? tx.method}` : ''}
        </p>
        <p className="text-xs text-white/40">{formatDateTime(tx.created_at)}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className={cn('text-sm font-semibold', isCredit ? 'text-success' : 'text-white/90')}>
          {formatSignedCurrency(tx.amount, tx.direction, currency)}
        </span>
        <StatusBadge status={tx.status} />
      </div>
    </div>
  );
}
