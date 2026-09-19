'use client';

import { useActionState, useEffect, useRef } from 'react';
import { requestWithdrawal } from '@/lib/actions/wallet';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, FieldError } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils/currency';

export function WithdrawForm({
  availableBalance,
  currency,
  onSuccess,
}: {
  availableBalance: number;
  currency: string;
  onSuccess?: () => void;
}) {
  const [state, formAction, isPending] = useActionState(requestWithdrawal, {});
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      onSuccess?.();
    }
    wasPending.current = isPending;
  }, [isPending, state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="withdraw-amount">Amount</Label>
        <Input
          id="withdraw-amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          max={availableBalance || undefined}
          placeholder="0.00"
          required
        />
        <p className="mt-1.5 text-xs text-white/40">Available: {formatCurrency(availableBalance, currency)}</p>
      </div>
      <div>
        <Label htmlFor="withdraw-method">Method</Label>
        <Select id="withdraw-method" name="method" defaultValue="bank_transfer" required>
          <option value="bank_transfer">Bank transfer</option>
          <option value="upi">UPI</option>
          <option value="crypto">Crypto</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="withdraw-reference">Payout details (optional)</Label>
        <Input id="withdraw-reference" name="reference" placeholder="Account / UPI / wallet address" />
      </div>
      <FieldError message={state.error} />
      <p className="text-xs text-white/40">
        Withdrawal requests are reviewed by an admin before funds are released.
      </p>
      <Button type="submit" variant="secondary" className="w-full" loading={isPending} disabled={availableBalance <= 0}>
        Submit withdrawal request
      </Button>
    </form>
  );
}
