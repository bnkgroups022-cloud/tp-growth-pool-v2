'use client';

import { useActionState } from 'react';
import { createAdjustment } from '@/lib/actions/admin';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, FieldError } from '@/components/ui/input';

export function AdjustmentForm({ userId }: { userId: string }) {
  const [state, formAction, isPending] = useActionState(createAdjustment, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="userId" value={userId} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="adj-amount">Amount</Label>
          <Input id="adj-amount" name="amount" type="number" step="0.01" min="0.01" placeholder="0.00" required />
        </div>
        <div>
          <Label htmlFor="adj-direction">Direction</Label>
          <Select id="adj-direction" name="direction" defaultValue="credit" required>
            <option value="credit">Credit (+)</option>
            <option value="debit">Debit (−)</option>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="adj-note">Reason (required, visible in audit log)</Label>
        <Input id="adj-note" name="note" placeholder="e.g. Correcting duplicate deposit" required minLength={3} />
      </div>
      <FieldError message={state.error} />
      <Button type="submit" variant="secondary" className="w-full" loading={isPending}>
        Apply adjustment
      </Button>
    </form>
  );
}
