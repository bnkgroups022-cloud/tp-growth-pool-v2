'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { verifyOtp, resendOtp } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';
import { GlassPanel } from '@/components/ui/glass-panel';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" loading={pending}>
      Verify &amp; continue
    </Button>
  );
}

export function OtpVerifyForm({ phone }: { phone: string }) {
  const [state, formAction] = useActionState(verifyOtp, {});
  const [cooldown, setCooldown] = useState(30);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleResend() {
    setResending(true);
    setResendError(undefined);
    const result = await resendOtp(phone);
    if (result.error) setResendError(result.error);
    else setCooldown(30);
    setResending(false);
  }

  return (
    <GlassPanel className="p-6">
      <h2 className="text-base font-semibold text-white">Enter your code</h2>
      <p className="mt-1 text-sm text-white/50">
        Sent to <span className="text-white/80">{phone}</span>
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="phone" value={phone} />
        <div>
          <Label htmlFor="token">6-digit code</Label>
          <Input
            ref={inputRef}
            id="token"
            name="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="••••••"
            className="text-center text-lg tracking-[0.6em]"
            required
          />
          <FieldError message={state.error} />
        </div>
        <SubmitButton />
      </form>

      <div className="mt-4 text-center text-sm">
        {cooldown > 0 ? (
          <span className="text-white/35">Resend code in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-accent-300 hover:text-accent-200 disabled:opacity-50"
          >
            {resending ? 'Resending…' : 'Resend code'}
          </button>
        )}
        <FieldError message={resendError} />
      </div>
    </GlassPanel>
  );
}
