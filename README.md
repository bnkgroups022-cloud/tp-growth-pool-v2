# TP Growth Pool v1.0

Trading Point's member platform — phone OTP login, wallet, business
selection, a live activity feed, and a basic admin panel. Built with
Next.js 15 (App Router), Tailwind CSS, and Supabase (Auth + Postgres).

This is a **complete vertical slice**: every piece is production-quality
and wired end-to-end (real schema, real RLS, real auth), and the codebase
is deliberately structured so the next modules — Investing, Real Estate,
AI Business, Digital Marketing, Reports, Referral, Notifications — extend
it instead of requiring a rewrite. See [Extending this app](#extending-this-app-phase-2)
at the bottom.

## Stack

- **Next.js 15** (App Router, Server Components, Server Actions, React 19)
- **Tailwind CSS** — dark-blue glassmorphism design system (`tailwind.config.ts`)
- **Supabase** — Postgres, Auth (phone OTP), Row Level Security, Realtime
- **Recharts** — wallet balance trend
- **Zod** — form/action input validation
- No icon package, no UI kit — a small dependency-free icon set
  (`src/components/ui/icon.tsx`) and hand-built primitives keep the bundle
  lean and every visual under your control.

## Project structure

```
src/
  app/
    (auth)/login, (auth)/verify        Phone OTP sign-in
    (dashboard)/dashboard              Home: balance, trend chart, activity, recent txns
    (dashboard)/wallet, wallet/transactions   Wallet actions + full ledger
    (dashboard)/business               Business selection grid
    (dashboard)/activity               Full live activity feed
    (dashboard)/admin, admin/users, admin/transactions   Admin panel
  components/
    ui/          Shared primitives (Button, GlassPanel, Input, Badge, Icon, ...)
    layout/      Sidebar, bottom nav, topbar
    dashboard/   Wallet/business/activity widgets
    admin/       Admin-only widgets
    forms/       Client forms wired to Server Actions
  lib/
    supabase/    Browser / server / middleware / admin (service-role) clients
    actions/     Server Actions (auth, wallet, business, admin)
    data/        Server-side data-fetching helpers (one file per domain)
    validation/  Zod schemas
    types/       Hand-written Supabase types + domain types
    config/      Site config, nav items, the business-module registry
supabase/
  migrations/    Numbered, idempotent SQL migrations
  seed.sql       Business-type catalog seed
  config.toml    Supabase CLI config
public/
  icons/, sw.js  PWA assets + service worker
```

## 1. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the Project URL, `anon` public key,
   and `service_role` key.
3. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_DEFAULT_CURRENCY=USD
   ```

## 2. Run the database migrations

Using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push        # applies supabase/migrations/*.sql in order
supabase db seed        # or: psql "$DATABASE_URL" -f supabase/seed.sql
```

Or paste each file in `supabase/migrations/` (in numeric order) into the
Supabase Dashboard's **SQL Editor**, then run `supabase/seed.sql`.

The migrations create every table, enum, trigger, and RLS policy described
in [Database design](#database-design) below — nothing further to configure
in the schema itself.

## 3. Turn on phone OTP auth

Phone OTP needs an SMS provider — Supabase doesn't send SMS itself.

1. Dashboard → **Authentication → Providers → Phone** → enable.
2. Pick a provider (Twilio, MessageBird, Vonage, or MSG91 — MSG91/Twilio
   are the common choices for an India-facing product like Trading Point)
   and enter its account SID/API keys there.
3. Dashboard → **Authentication → URL Configuration** → set Site URL to
   your deployed domain (and add `http://localhost:3000` under redirect
   URLs for local dev).

Local dev without a provider configured: the Supabase CLI logs the OTP
code to your terminal instead of sending a real SMS, so you can still test
the full flow.

## 4. Enable Realtime for the live activity feed

Dashboard → **Database → Replication** → turn on Realtime for the
`activity_feed` table (or run
`alter publication supabase_realtime add table public.activity_feed;`
in the SQL Editor). Without this the feed still renders the initial
server-fetched rows — it just won't update live until you enable it.

## 5. First admin

There's no public "make me admin" button, by design. After signing up
once through the app (so a `profiles` row exists), promote yourself from
the SQL Editor:

```sql
update public.profiles set role = 'admin' where phone = '+15551234567';
```

`/admin` becomes visible in the sidebar immediately for that account.

## Local development

```bash
npm install
npm run dev
```

> **A note on this repository's origin:** this codebase was generated in a
> sandboxed environment with no access to the npm registry, so dependencies
> have never been installed or build-verified by the tool that wrote it.
> Every file was hand-written to the exact shape `create-next-app` plus
> manual setup would produce, and reviewed carefully, but run `npm install`
> and `npm run build` yourself before deploying, and open an issue-style
> note back if anything doesn't compile cleanly — most likely culprits
> would be a dependency version bump upstream, not the app code.

### Dependency resolution notes (React 19 / Next 15)

If `npm install` ever fails with an `ERESOLVE` / "Could not resolve
dependency" error mentioning React, it's the same root cause every time:
some package in the tree (Next.js itself on very early 15.0.x releases, or
a UI library like `recharts` that hasn't updated its `peerDependencies`
yet) declares a narrower React version range than whatever React 19 patch
npm is trying to install. This repo guards against that three ways:

1. **`next` and `eslint-config-next` are floored at `^15.1.0`**, not
   `15.0.x` — the early Next 15.0.0–15.0.3 releases shipped during the
   React 19 RC→stable transition and pinned peer ranges tightly; 15.1+
   settled on a proper `react`/`react-dom` range.
2. **`overrides` in `package.json`** pins `react` and `react-dom` to a
   single resolved range tree-wide, so no transitive dependency can pull
   in a second, mismatched copy of React.
3. **`.npmrc` sets `legacy-peer-deps=true`**, so a peer-range check that's
   merely out of date (a library that still lists `react ^18` in its
   `peerDependencies` but works fine on 19) produces a warning instead of
   a hard install failure — the `overrides` above is what actually
   guarantees a single, consistent React version gets installed.

There's intentionally no `package-lock.json` committed: it's only ever
generated by actually running `npm install` against the real registry,
which this environment can't reach (see the note above) — a hand-written
lockfile would ship fake integrity hashes and break `npm ci` outright,
which is worse than no lockfile. Run `npm install` once (locally or as
Vercel's own build step) and commit the `package-lock.json` it produces
so future installs are fully reproducible.

**A `@supabase/supabase-js` entry was also added to `overrides`.** `legacy-peer-deps=true` (above) makes npm more willing to satisfy a peer
conflict by installing a *second*, nested copy of a package inside
whichever dependency asked for a different range — and `@supabase/ssr`
depends on `@supabase/supabase-js` too. Two separate copies of the
`SupabaseClient` class in `node_modules` are not the same type as far as
TypeScript is concerned (its private fields make the two structurally
distinct even though they're "the same" class), which surfaces as a
confusing build error where a function's declared `SupabaseClient<Database>`
parameter type doesn't accept the `SupabaseClient<Database>` a client
factory actually returns. The `overrides` entry forces every package in
the tree, `@supabase/ssr` included, to resolve to the one top-level
`@supabase/supabase-js` install, so there's only ever one `SupabaseClient`
class to have an identity with.

**On top of that**, every function in `src/lib/data/*.ts` that takes a
Supabase client parameter is typed with `TypedSupabaseClient` (exported
from `src/lib/supabase/server.ts` as `Awaited<ReturnType<typeof createClient>>`)
instead of independently writing `SupabaseClient<Database>` from
`@supabase/supabase-js`. That makes the parameter type *whatever
`createClient()` actually returns*, by construction — so even if some
future dependency change reintroduces a duplicate-copy scenario, the type
used by callers and the type produced by the factory can't drift apart.

**A second, unrelated type error was fixed in the same area:**
`wallet_transactions.Insert` in `database.types.ts` used to be written
`Partial<Row> & { type: '...'; amount: string | number }`. That pattern
looks like it widens `amount` to accept a number, but TypeScript
intersects overlapping property types instead of letting the second one
win — `(string | undefined) & (string | number)` collapses to `string`,
so `amount: string | number` was silently narrowed back down to just
`string`. That broke every insert that passes a coerced `number` amount
(`lib/actions/wallet.ts`, `lib/actions/admin.ts`), which is exactly what
the zod schemas in `lib/validation/wallet.ts` produce. Fixed by omitting
the keys being widened from the `Partial<Row>` base first —
`Partial<Omit<Row, 'type' | 'amount'>> & { type: ...; amount: string | number }`
— so there's no leftover conflicting property for the intersection to
narrow.

This was caught by building an offline TypeScript verification harness
(hand-written `.d.ts` stubs for `@supabase/ssr`, `@supabase/supabase-js`,
`next/*`, and `zod`, modelled on each package's real public API) and
running the real `tsc` compiler against every file in `src/lib`, `src/app`'s
plain-`.ts` route files, `src/middleware.ts`, and `src/hooks` — the
project's Supabase/database-typing layer — since this sandbox has no
network access to actually run `npm install`. It came back with zero
errors after this fix. The `.tsx` component/page layer (which needs full
React/JSX typings this harness doesn't attempt to replicate) was instead
reviewed by hand for the Next.js 15 App Router patterns most likely to
break a build — async `params`/`searchParams`, Server vs Client Component
boundaries, `useActionState`/`useFormStatus` usage — and no issues were
found there.

Open [http://localhost:3000](http://localhost:3000). You'll land on
`/login` until you sign in.

Useful scripts:

```bash
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
npm run type-check   # tsc --noEmit
npm run build        # production build
npm run db:types     # regenerate src/lib/types/database.types.ts from the live schema
```

## Deploying to Vercel

1. Push this repo to GitHub (see below).
2. [Import the repo](https://vercel.com/new) into Vercel — it auto-detects
   Next.js, no `vercel.json` needed.
3. Add the same environment variables from `.env.local` in **Project →
   Settings → Environment Variables** (all of them, including
   `SUPABASE_SERVICE_ROLE_KEY` — mark it as a server-only/sensitive value).
   Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Deploy. Update the Supabase Auth Site URL / redirect URLs to match your
   Vercel domain (step 3 above).

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: TP Growth Pool v1.0"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

`.env.local` is gitignored — never commit real Supabase keys.

## Database design

**Tables:** `profiles`, `wallets`, `business_types`, `business_selections`,
`wallet_transactions`, `activity_feed`, `admin_actions`.

**The ledger is the source of truth.** `wallets.balance` is a cached number
that only ever changes inside a database trigger
(`apply_completed_wallet_transaction` in
`supabase/migrations/0003_functions_and_triggers.sql`), fired when a
`wallet_transactions` row transitions to `status = 'completed'`. No
application code — not even the admin actions — writes to
`wallets.balance` directly. That means the balance can always be
reconstructed from the transaction history, and a `balance >= 0` check
constraint is a hard backstop against ever overdrawing a wallet.

**Every request is a ledger row, not a balance mutation.** A member's
deposit/withdrawal request inserts a `pending` `wallet_transactions` row.
An admin approving or rejecting it is an `UPDATE` on that same row — the
`prepare_wallet_transaction_update` trigger freezes who/what/how-much, and
stamps `reviewed_by`/`reviewed_at` from the session automatically, so it
can't be forged from the client. Every status change an admin makes also
writes an immutable row to `admin_actions` for audit purposes.

**Row Level Security is default-deny.** Every table has RLS enabled with
explicit policies (`0004_row_level_security.sql`) built on a single
`is_admin()` SQL function — there's no path where a client can read
another member's wallet, forge a transaction for someone else, or grant
itself the admin role. The admin panel's Server Actions run through the
same policies using the signed-in admin's own session (see the comment in
`src/lib/supabase/admin.ts` for the one exception: a service-role client
reserved for the rare operation RLS can't express, e.g. deleting an
`auth.users` row).

**The activity feed is anonymized by construction.** Rows are inserted
only by `SECURITY DEFINER` triggers (new signup, business joined, deposit
or withdrawal completed) with generic messages that never include a name
or amount — there's no RLS `INSERT` policy for clients at all, so nothing
in the UI can write directly to it.

## Extending this app (Phase 2)

The schema and business-selection UI are already generic:

- **New business vertical** (Investing, Real Estate, AI Business, Digital
  Marketing): add a row to `business_types` (or flip an existing seeded
  row's `is_active` to `true`) and set `enabled: true` for it in
  `src/lib/config/site.ts`'s `BUSINESS_MODULES` — the Business Selection
  grid and `business_selections` table need no schema change.
- **Reports**: `wallet_transactions` already has everything a quarterly
  report needs (type, direction, amount, status, timestamps) — a Reports
  module is a new page + query against this table, not a new ledger.
  Fastest option: extend the Sheets/Docs export you're already using, or
  render Recharts summaries the same way `wallet-trend-chart.tsx` does.
- **Referral system**: add a `referrals` table (`referrer_id`,
  `referred_id`, `code`, timestamps) and a `referral_code` column on
  `profiles`; award commissions as `wallet_transactions` rows of type
  `adjustment` so they show up in the existing ledger/report/admin-approval
  machinery for free.
- **Notification Center**: add a `notifications` table + a bell icon in
  `topbar.tsx` following the exact pattern `activity-feed.tsx` /
  `use-realtime-activity.ts` already establish (Supabase Realtime
  subscription + server-fetched initial page).
- **KYC**: add a `kyc_status` enum column on `profiles` plus a
  `kyc_documents` table pointing at Supabase Storage objects; gate wallet
  actions behind `kyc_status = 'verified'` in both the RLS policy and the
  Server Action.

None of the above requires touching `wallets`, the trigger functions, or
the RLS policies for the tables that already exist.

## What's intentionally out of scope for v1.0

Per the agreed Phase-1 scope, this slice does **not** include: KYC,
trading-risk-tier selection, quarterly reports, notification center, or
the referral system — the schema above is shaped so each slots in without
a rewrite. A member also can't cancel their own pending request yet
(admin reject covers the same need for now).
