'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requestOtpSchema, verifyOtpSchema } from '@/lib/validation/auth';

export type ActionResult = { error: string } | { error?: undefined };

/** Step 1 of OTP login: ask Supabase Auth to text a 6-digit code to the phone. */
export async function requestOtp(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = requestOtpSchema.safeParse({ phone: formData.get('phone') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid phone number' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone: parsed.data.phone });

  if (error) {
    return { error: error.message };
  }

  redirect(`/verify?phone=${encodeURIComponent(parsed.data.phone)}`);
}

/** Step 2 of OTP login: verify the code and establish the session. */
export async function verifyOtp(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = verifyOtpSchema.safeParse({
    phone: formData.get('phone'),
    token: formData.get('token'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid code' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone: parsed.data.phone,
    token: parsed.data.token,
    type: 'sms',
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function resendOtp(phone: string): Promise<ActionResult> {
  const parsed = requestOtpSchema.safeParse({ phone });
  if (!parsed.success) return { error: 'Invalid phone number' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone: parsed.data.phone });
  if (error) return { error: error.message };
  return {};
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
