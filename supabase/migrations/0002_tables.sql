-- TP Growth Pool — 0002: core tables
-- Every future module (Investing, Real Estate, AI Business, Digital
-- Marketing, Reports, Referral, Notifications) is expected to extend this
-- schema rather than replace it — business_types/business_selections and
-- wallet_transactions are intentionally generic.

-- Extends auth.users with app-facing profile data.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text unique,
  full_name text,
  role public.app_role not null default 'user',
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'One row per authenticated member, created automatically on signup.';

-- One wallet per user. Balance is NEVER written directly by the app —
-- only by the trigger in 0003 when a ledger transaction is completed.
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  currency text not null default 'USD',
  balance numeric(18, 2) not null default 0 check (balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.wallets is 'Cached balance, always derived from wallet_transactions — the ledger is the source of truth.';

-- Catalog of business verticals. Seeded in supabase/seed.sql; only
-- `trading` is is_active = true for v1.0, the rest are Phase-2 placeholders.
create table if not exists public.business_types (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  tagline text,
  is_active boolean not null default false,
  sort_order int not null default 0
);
comment on table public.business_types is 'Catalog of business verticals shown on the Business Selection screen.';

-- Which business(es) a member has opted into.
create table if not exists public.business_selections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  business_type_id uuid not null references public.business_types (id) on delete restrict,
  status public.business_selection_status not null default 'active',
  selected_at timestamptz not null default now(),
  unique (user_id, business_type_id)
);

-- The append-only ledger. Every deposit/withdrawal/adjustment is a row
-- here; wallets.balance is a materialized sum kept in sync by trigger.
create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  wallet_id uuid not null references public.wallets (id) on delete cascade,
  type public.transaction_type not null,
  direction public.transaction_direction not null,
  amount numeric(18, 2) not null check (amount > 0),
  status public.transaction_status not null default 'pending',
  method text,
  reference text,
  note text,
  created_by uuid not null references public.profiles (id),
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.wallet_transactions is 'Append-only ledger. Source of truth for wallet balances and transaction history.';

-- Anonymized, platform-wide feed. No amounts or names — see 0003 triggers
-- for exactly what gets written.
create table if not exists public.activity_feed (
  id uuid primary key default gen_random_uuid(),
  type public.activity_type not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

-- Immutable audit trail of admin actions on the ledger.
create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles (id),
  action text not null,
  target_user_id uuid references public.profiles (id),
  target_transaction_id uuid references public.wallet_transactions (id),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
