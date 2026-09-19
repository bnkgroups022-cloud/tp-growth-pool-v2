'use client';

import { useActionState, useEffect, useRef } from 'react';
import { requestDeposit } from '@/lib/actions/wallet';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, FieldError } from '@/components/ui/input';

export function DepositForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, isPending] = useActionState(requestDeposit, {});
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
        <Label htmlFor="deposit-amount">Amount</Label>
        <Input id="deposit-amount" name="amount" type="number" step="0.01" min="0.01" placeholder="0.00" required />
      </div>
      <div>
        <Label htmlFor="deposit-method">Method</Label>
        <Select id="deposit-method" name="method" defaultValue="bank_transfer" required>
          <option value="bank_transfer">Bank transfer</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="crypto">Crypto</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="deposit-reference">Reference (optional)</Label>
        <Input id="deposit-reference" name="reference" placeholder="Transaction / UTR number" />
      </div>
      <FieldError message={state.error} />
      <p className="text-xs text-white/40">
        Your deposit is submitted as a pending request and credited once an admin confirms funds were received.
      </p>
      <Button type="submit" className="w-full" loading={isPending}>
        Submit deposit request
      </Button>
    </form>
  );
}
