import type { TypedSupabaseClient } from '@/lib/supabase/server';
import type { WalletTransaction } from '@/lib/types/domain';

type Client = TypedSupabaseClient;

export async function getRecentTransactions(supabase: Client, userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as WalletTransaction[];
}

export interface TransactionFilters {
  status?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}

export async function getTransactionHistory(supabase: Client, userId: string, filters: TransactionFilters = {}) {
  const { status, type, page = 1, pageSize = 15 } = filters;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('wallet_transactions')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (type) query = query.eq('type', type);

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return { rows: (data ?? []) as WalletTransaction[], count: count ?? 0, page, pageSize };
}

/**
 * Cumulative wallet balance over the trailing `days`, built from completed
 * ledger rows. Used by the dashboard's Recharts trend line. This walks the
 * real ledger backwards from the current balance rather than inventing
 * numbers — if there's no history yet, every point is just the current
 * balance.
 */
export async function getBalanceTrend(supabase: Client, userId: string, currentBalance: number, days = 14) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('amount, direction, created_at')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;

  const byDay = new Map<string, number>(); // date -> net change that day
  for (const tx of data ?? []) {
    const day = tx.created_at.slice(0, 10);
    const signed = tx.direction === 'credit' ? Number(tx.amount) : -Number(tx.amount);
    byDay.set(day, (byDay.get(day) ?? 0) + signed);
  }

  const points: { date: string; balance: number }[] = [];
  let runningBalance = currentBalance;
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    points.unshift({ date: key, balance: Math.max(0, Math.round(runningBalance * 100) / 100) });
    runningBalance -= byDay.get(key) ?? 0;
  }

  return points;
}
