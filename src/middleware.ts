import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every route except static assets, images, and the PWA
     * manifest/service worker, which don't need auth-session refresh.
     */
    '/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|icons/).*)',
  ],
};
