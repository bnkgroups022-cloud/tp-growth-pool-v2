'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { depositSchema, withdrawSchema } from '@/lib/validation/wallet';
import type { ActionResult } from './auth';

/**
 * Both actions below insert a 'pending' row into wallet_transactions.
 * They never touch wallets.balance directly — the database trigger in
 * supabase/migrations/0003_functions_and_triggers.sql is the only thing
 * allowed to do that, and only once an admin marks the row 'completed'.
 */

export async function requestDeposit(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = depositSchema.safeParse({
    amount: formData.get('amount'),
    method: formData.get('method'),
    reference: formData.get('reference') ?? '',
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid deposit request' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You need to be signed in.' };

  const { error } = await supabase.from('wallet_transactions').insert({
    type: 'deposit',
    amount: parsed.data.amount,
    method: parsed.data.method,
    reference: parsed.data.reference || null,
    // user_id / wallet_id / direction / status / created_by are all
    // overwritten server-side by the BEFORE INSERT trigger — this app
    // never trusts the client for those fields.
    user_id: user.id,
    direction: 'credit',
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath('/wallet');
  revalidatePath('/dashboard');
  return {};
}

export async function requestWithdrawal(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = withdrawSchema.safeParse({
    amount: formData.get('amount'),
    method: formData.get('method'),
    reference: formData.get('reference') ?? '',
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid withdrawal request' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You need to be signed in.' };

  const { data: wallet } = await supabase.from('wallets').select('balance').eq('user_id', user.id).single();
  if (wallet && Number(wallet.balance) < parsed.data.amount) {
    return { error: 'Withdrawal amount exceeds your available balance.' };
  }

  const { error } = await supabase.from('wallet_transactions').insert({
    type: 'withdrawal',
    amount: parsed.data.amount,
    method: parsed.data.method,
    reference: parsed.data.reference || null,
    user_id: user.id,
    direction: 'debit',
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath('/wallet');
  revalidatePath('/dashboard');
  return {};
}
