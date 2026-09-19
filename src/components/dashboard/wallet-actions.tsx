'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Icon } from '@/components/ui/icon';
import { DepositForm } from '@/components/forms/deposit-form';
import { WithdrawForm } from '@/components/forms/withdraw-form';
import { cn } from '@/lib/utils/cn';

type Tab = 'deposit' | 'withdraw';

export function WalletActions({ balance, currency }: { balance: number; currency: string }) {
  const [tab, setTab] = useState<Tab>('deposit');
  const [justSubmitted, setJustSubmitted] = useState<Tab | null>(null);
  const router = useRouter();

  function handleSuccess(kind: Tab) {
    setJustSubmitted(kind);
    router.refresh();
  }

  return (
    <GlassPanel className="p-5 md:p-6">
      <div className="mb-5 flex gap-2 rounded-xl bg-white/[0.04] p-1">
        {(['deposit', 'withdraw'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              setJustSubmitted(null);
            }}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors',
              tab === t ? 'bg-white/[0.09] text-white' : 'text-white/45 hover:text-white/70'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {justSubmitted === tab ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success">
            <Icon name="check" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-white">Request submitted</p>
            <p className="mt-1 text-sm text-white/45">
              Your {tab} request is pending admin review — track it in your transaction ledger.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setJustSubmitted(null)}
            className="text-xs font-medium text-accent-300 hover:text-accent-200"
          >
            Submit another
          </button>
        </div>
      ) : tab === 'deposit' ? (
        <DepositForm onSuccess={() => handleSuccess('deposit')} />
      ) : (
        <WithdrawForm availableBalance={balance} currency={currency} onSuccess={() => handleSuccess('withdraw')} />
      )}
    </GlassPanel>
  );
}
