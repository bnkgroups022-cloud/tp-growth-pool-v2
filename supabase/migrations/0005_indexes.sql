-- TP Growth Pool — 0005: indexes
-- Targets the access patterns used by the dashboard, wallet ledger, admin
-- approvals queue, and the live activity feed.

create index if not exists idx_wallet_tx_user_created
  on public.wallet_transactions (user_id, created_at desc);

create index if not exists idx_wallet_tx_status
  on public.wallet_transactions (status)
  where status = 'pending';

create index if not exists idx_business_selections_user
  on public.business_selections (user_id);

create index if not exists idx_activity_feed_created
  on public.activity_feed (created_at desc)
  where is_public = true;

create index if not exists idx_profiles_role
  on public.profiles (role);

-- wallets.user_id already has a unique constraint (see 0002), which
-- Postgres backs with its own index — no separate index needed here.
