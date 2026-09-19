'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { requestOtp } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Icon } from '@/components/ui/icon';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" loading={pending}>
      Send code
    </Button>
  );
}

export function OtpRequestForm() {
  const [state, formAction] = useActionState(requestOtp, {});

  return (
    <GlassPanel className="p-6">
      <h2 className="text-base font-semibold text-white">Sign in</h2>
      <p className="mt-1 text-sm text-white/50">We&apos;ll text you a 6-digit one-time code.</p>

      <form action={formAction} className="mt-5 space-y-4">
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/35">
              <Icon name="phone" className="h-4 w-4" />
            </span>
            <Input id="phone" name="phone" type="tel" placeholder="+1 415 555 0134" className="pl-10" required autoFocus />
          </div>
          <FieldError message={state.error} />
        </div>
        <SubmitButton />
        <p className="text-center text-xs text-white/35">
          Use international format, e.g. +14155550134. Standard SMS rates may apply.
        </p>
      </form>
    </GlassPanel>
  );
}
