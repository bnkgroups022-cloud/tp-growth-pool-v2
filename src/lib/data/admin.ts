import type { TypedSupabaseClient } from '@/lib/supabase/server';
import type { Profile, Wallet, WalletTransaction } from '@/lib/types/domain';

type Client = TypedSupabaseClient;

export async function getAdminOverviewStats(supabase: Client) {
  const [{ count: totalUsers }, { count: pendingCount }, { data: wallets }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('wallet_transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('wallets').select('balance'),
  ]);

  const totalBalance = (wallets ?? []).reduce((sum, w) => sum + Number(w.balance), 0);

  return {
    totalUsers: totalUsers ?? 0,
    pendingCount: pendingCount ?? 0,
    totalBalance,
  };
}

export async function getUsersList(supabase: Client, { search, page = 1, pageSize = 15 }: { search?: string; page?: number; pageSize?: number }) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (search) query = query.or(`phone.ilike.%${search}%,full_name.ilike.%${search}%`);

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return { rows: (data ?? []) as Profile[], count: count ?? 0, page, pageSize };
}

export async function getUserDetail(supabase: Client, userId: string) {
  const [{ data: profile }, { data: wallet }, { data: transactions }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('wallets').select('*').eq('user_id', userId).single(),
    supabase.from('wallet_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(25),
  ]);

  return {
    profile: profile as Profile | null,
    wallet: wallet as Wallet | null,
    transactions: (transactions ?? []) as WalletTransaction[],
  };
}

export async function getPendingTransactions(supabase: Client, { page = 1, pageSize = 15 }: { page?: number; pageSize?: number } = {}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('wallet_transactions')
    .select('*, profiles!wallet_transactions_user_id_fkey(phone, full_name)', { count: 'exact' })
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .range(from, to);

  if (error) throw error;

  return { rows: (data ?? []) as (WalletTransaction & { profiles: Pick<Profile, 'phone' | 'full_name'> | null })[], count: count ?? 0, page, pageSize };
}
