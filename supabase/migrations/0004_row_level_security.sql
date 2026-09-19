-- TP Growth Pool — 0004: Row Level Security
-- Default-deny on every table; each capability is an explicit policy.
-- Nothing here ever trusts a client-supplied role/user_id without also
-- checking auth.uid() or is_admin().

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.business_types enable row level security;
alter table public.business_selections enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.activity_feed enable row level security;
alter table public.admin_actions enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- Users may update their own row but can never grant themselves admin.
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id and role = 'user');

-- Admins may update any profile (e.g. suspend/activate, promote support staff).
drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- No INSERT policy: rows are created only by the handle_new_user trigger.
-- No DELETE policy: profiles are never deleted from the client.

-- ---------------------------------------------------------------------------
-- wallets — read-only from the client, always. Balance changes only ever
-- happen via the wallet_transactions trigger (0003), which runs as the
-- table owner and therefore bypasses RLS.
-- ---------------------------------------------------------------------------
drop policy if exists wallets_select_own_or_admin on public.wallets;
create policy wallets_select_own_or_admin on public.wallets
  for select using (auth.uid() = user_id or public.is_admin());

-- ---------------------------------------------------------------------------
-- business_types — readable catalog, DB-managed (migrations/seed only).
-- ---------------------------------------------------------------------------
drop policy if exists business_types_select_all on public.business_types;
create policy business_types_select_all on public.business_types
  for select using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- business_selections
-- ---------------------------------------------------------------------------
drop policy if exists business_selections_select_own_or_admin on public.business_selections;
create policy business_selections_select_own_or_admin on public.business_selections
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists business_selections_insert_own on public.business_selections;
create policy business_selections_insert_own on public.business_selections
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.business_types
      where id = business_type_id and is_active = true
    )
  );

-- ---------------------------------------------------------------------------
-- wallet_transactions — the ledger.
-- ---------------------------------------------------------------------------
drop policy if exists wallet_tx_select_own_or_admin on public.wallet_transactions;
create policy wallet_tx_select_own_or_admin on public.wallet_transactions
  for select using (auth.uid() = user_id or public.is_admin());

-- Members may only ever request a deposit/withdrawal for themselves;
-- the BEFORE INSERT trigger in 0003 has already forced user_id = auth.uid()
-- and status = 'pending' by the time this check runs. Admins may also
-- insert directly (used for manual 'adjustment' rows).
drop policy if exists wallet_tx_insert_self_or_admin on public.wallet_transactions;
create policy wallet_tx_insert_self_or_admin on public.wallet_transactions
  for insert with check (
    (type in ('deposit', 'withdrawal') and user_id = auth.uid())
    or public.is_admin()
  );

-- Only admins can transition a transaction's status (approve/reject).
-- The BEFORE UPDATE trigger freezes every other field.
drop policy if exists wallet_tx_update_admin on public.wallet_transactions;
create policy wallet_tx_update_admin on public.wallet_transactions
  for update using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- activity_feed — public read for signed-in members, no client writes
-- (rows are inserted only by SECURITY DEFINER triggers in 0003).
-- ---------------------------------------------------------------------------
drop policy if exists activity_feed_select_public on public.activity_feed;
create policy activity_feed_select_public on public.activity_feed
  for select using (is_public = true and auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- admin_actions — immutable audit log, admin-only, no client writes.
-- ---------------------------------------------------------------------------
drop policy if exists admin_actions_select_admin on public.admin_actions;
create policy admin_actions_select_admin on public.admin_actions
  for select using (public.is_admin());
