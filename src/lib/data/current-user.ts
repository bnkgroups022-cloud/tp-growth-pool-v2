import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile, Wallet } from '@/lib/types/domain';

/**
 * Loads the signed-in user's profile + wallet for Server Components.
 * Middleware already guarantees a session on protected routes, so hitting
 * the `redirect` branch here means the session cookie vanished mid-request
 * — safe to just bounce to /login.
 */
export async function getCurrentUserContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: profile }, { data: wallet }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('wallets').select('*').eq('user_id', user.id).single(),
  ]);

  return {
    user,
    profile: profile as Profile | null,
    wallet: wallet as Wallet | null,
  };
}

export async function requireAdminContext() {
  const ctx = await getCurrentUserContext();
  if (ctx.profile?.role !== 'admin') redirect('/dashboard');
  return ctx;
}
