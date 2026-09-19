import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/types/database.types';
import { getSupabaseEnv } from './env';

/**
 * Server-side Supabase client for Server Components, Server Actions, and
 * Route Handlers. Reads/writes the auth session via cookies and is subject
 * to RLS as the signed-in user — this is what every "own row" policy in
 * supabase/migrations/0004_row_level_security.sql is written against.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as CookieOptions);
          });
        } catch {
          // Called from a Server Component render — middleware.ts already
          // refreshes the session on the request/response cycle, so this
          // can be safely ignored.
        }
      },
    },
  });
}

/**
 * The single source of truth for "what type is a server-side Supabase
 * client". Every function that accepts a `supabase` client as a parameter
 * (see src/lib/data/*.ts) should use this type rather than reconstructing
 * `SupabaseClient<Database>` from `@supabase/supabase-js` itself — deriving
 * it from createClient()'s actual return type guarantees they can never
 * drift apart, even if `@supabase/ssr` and `@supabase/supabase-js` resolve
 * to slightly different versions in the dependency tree (the root cause of
 * the "Type mismatch between SupabaseClient<Database> ... and the type
 * expected by ..." build error this type exists to prevent).
 */
export type TypedSupabaseClient = Awaited<ReturnType<typeof createClient>>;
