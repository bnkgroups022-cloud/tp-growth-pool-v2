'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { adjustmentSchema, reviewTransactionSchema } from '@/lib/validation/wallet';
import type { ActionResult } from './auth';

/**
 * Every action here relies on the `is_admin()` RLS policies in
 * supabase/migrations/0004_row_level_security.sql for the actual security
 * boundary — a non-admin's request is rejected by Postgres itself, not
 * just hidden in the UI. The role check below exists only to return a
 * clear error message instead of a silent "0 rows updated".
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false as const };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return { supabase, user, isAdmin: profile?.role === 'admin' };
}

export async function reviewTransaction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = reviewTransactionSchema.safeParse({
    transactionId: formData.get('transactionId'),
    decision: formData.get('decision'),
    note: formData.get('note') ?? '',
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid review' };

  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: 'Admin access required.' };

  const update: { status: 'completed' | 'rejected'; note?: string } = { status: parsed.data.decision };
  if (parsed.data.note) update.note = parsed.data.note;

  const { error, data } = await supabase
    .from('wallet_transactions')
    .update(update)
    .eq('id', parsed.data.transactionId)
    .eq('status', 'pending')
    .select('id');

  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: 'That request was already reviewed by someone else.' };

  revalidatePath('/admin/transactions');
  revalidatePath('/admin');
  return {};
}

export async function createAdjustment(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = adjustmentSchema.safeParse({
    userId: formData.get('userId'),
    amount: formData.get('amount'),
    direction: formData.get('direction'),
    note: formData.get('note'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid adjustment' };

  const { supabase, user, isAdmin } = await requireAdmin();
  if (!isAdmin || !user) return { error: 'Admin access required.' };

  const { error } = await supabase.from('wallet_transactions').insert({
    type: 'adjustment',
    user_id: parsed.data.userId,
    amount: parsed.data.amount,
    direction: parsed.data.direction,
    note: parsed.data.note,
    created_by: user.id,
    status: 'completed',
  });

  if (error) return { error: error.message };

  revalidatePath(`/admin/users/${parsed.data.userId}`);
  revalidatePath('/admin');
  return {};
}

export async function setUserStatus(userId: string, status: 'active' | 'suspended'): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: 'Admin access required.' };

  const { error } = await supabase.from('profiles').update({ status }).eq('id', userId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath('/admin/users');
  return {};
}
