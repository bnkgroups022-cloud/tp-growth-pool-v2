import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database.types';

/**
 * Service-role Supabase client — BYPASSES Row Level Security entirely.
 *
 * The admin panel in this app deliberately does NOT use this client for
 * routine actions (listing users, adjusting balances, approving
 * transactions): those go through the normal server client
 * (lib/supabase/server.ts) and are authorized by the `is_admin()` RLS
 * policies in supabase/migrations/0004_row_level_security.sql, using the
 * signed-in admin's own session. That keeps every admin action subject to
 * the same auditable, policy-checked path as everything else.
 *
 * Reach for this client only for the rare operation RLS structurally can't
 * express (e.g. deleting a row from `auth.users`, which lives outside the
 * `public` schema `is_admin()` can police). Never import this file into a
 * Client Component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for admin client.');
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Derived the same way as TypedSupabaseClient in lib/supabase/server.ts — see that file's comment. */
export type TypedSupabaseAdminClient = ReturnType<typeof createAdminClient>;
