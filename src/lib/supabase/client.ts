'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database.types';
import { getSupabaseEnv } from './env';

/**
 * Browser-side Supabase client, for use inside Client Components and hooks
 * (e.g. the realtime activity feed subscription). Talks to Postgres purely
 * through RLS — never has elevated privileges.
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}

/** Derived the same way as TypedSupabaseClient in lib/supabase/server.ts — see that file's comment. */
export type TypedSupabaseBrowserClient = ReturnType<typeof createClient>;
