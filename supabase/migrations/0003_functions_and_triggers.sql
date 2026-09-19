-- TP Growth Pool — 0003: functions & triggers
-- All functions here are created by the migration role (table owner), so
-- SECURITY DEFINER functions and triggers bypass RLS by design — this is
-- what lets us keep RLS locked down tight in 0004 while still allowing
-- controlled system writes (new-user provisioning, balance updates,
-- activity-feed entries, audit logging).

-- ---------------------------------------------------------------------------
-- is_admin(): the single check every admin RLS policy relies on.
-- STABLE + SECURITY DEFINER avoids the classic "RLS policy on profiles that
-- queries profiles" recursion problem.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- generic updated_at bumper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.wallets;
create trigger set_updated_at before update on public.wallets
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.wallet_transactions;
create trigger set_updated_at before update on public.wallet_transactions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- New-user provisioning: fires on auth.users insert (phone OTP signup).
-- Creates the profile + a zero-balance wallet, and drops one anonymized
-- row into the public activity feed.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, new.phone)
  on conflict (id) do nothing;

  insert into public.wallets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.activity_feed (type, message)
  values ('signup', 'A new member joined Trading Point.');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- wallet_transactions: BEFORE INSERT
-- Locks down what a self-service member submission can actually contain.
-- Deposits/withdrawals are always forced to the caller's own user_id,
-- status 'pending', and a direction derived from the type — a client
-- cannot request its own deposit be pre-approved or credited as a
-- withdrawal. 'adjustment' rows are admin-only (enforced in RLS, 0004) and
-- default to 'completed' immediately since an admin is asserting a fact,
-- not requesting approval.
-- ---------------------------------------------------------------------------
create or replace function public.prepare_wallet_transaction_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_wallet_id uuid;
begin
  if new.type in ('deposit', 'withdrawal') then
    new.user_id := auth.uid();
    new.created_by := auth.uid();
    new.status := 'pending';
    new.direction := case new.type when 'deposit' then 'credit' else 'debit' end;
    new.reviewed_by := null;
    new.reviewed_at := null;
  elsif new.type = 'adjustment' then
    new.created_by := coalesce(new.created_by, auth.uid());
    new.status := coalesce(new.status, 'completed');
    -- An adjustment is created and reviewed in the same act — record the
    -- acting admin as reviewer immediately so it shows up in admin_actions
    -- (see apply_completed_wallet_transaction) exactly like an approval.
    new.reviewed_by := new.created_by;
    new.reviewed_at := now();
  end if;

  select id into target_wallet_id from public.wallets where user_id = new.user_id;
  if target_wallet_id is null then
    raise exception 'No wallet found for user %', new.user_id;
  end if;
  new.wallet_id := target_wallet_id;

  return new;
end;
$$;

drop trigger if exists prepare_wallet_transaction_insert on public.wallet_transactions;
create trigger prepare_wallet_transaction_insert
  before insert on public.wallet_transactions
  for each row execute function public.prepare_wallet_transaction_insert();

-- ---------------------------------------------------------------------------
-- wallet_transactions: BEFORE UPDATE
-- Freezes every field that defines the transaction (who/what/how much) so
-- an admin review can only ever change status/method/reference/note. When
-- status actually changes, reviewed_by/reviewed_at are stamped from the
-- session automatically — never trusted from client input.
-- ---------------------------------------------------------------------------
create or replace function public.prepare_wallet_transaction_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.user_id := old.user_id;
  new.wallet_id := old.wallet_id;
  new.amount := old.amount;
  new.type := old.type;
  new.direction := old.direction;
  new.created_by := old.created_by;
  new.created_at := old.created_at;

  if new.status is distinct from old.status then
    new.reviewed_by := auth.uid();
    new.reviewed_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists prepare_wallet_transaction_update on public.wallet_transactions;
create trigger prepare_wallet_transaction_update
  before update on public.wallet_transactions
  for each row execute function public.prepare_wallet_transaction_update();

-- ---------------------------------------------------------------------------
-- wallet_transactions: AFTER INSERT OR UPDATE
-- The only place wallets.balance is ever mutated. Runs exactly once, the
-- moment a row's status IS 'completed' with no prior 'completed' state —
-- which covers two distinct paths: a member's deposit/withdrawal being
-- approved (an UPDATE from 'pending'), and an admin's manual adjustment,
-- which is inserted already 'completed' (an INSERT, with no OLD row at
-- all — using TG_OP to branch is required here, not just `old.status`,
-- which would error on INSERT). A withdrawal that would overdraw the
-- wallet raises and rolls back the whole approval — the `balance >= 0`
-- check constraint is the hard backstop either way.
-- ---------------------------------------------------------------------------
create or replace function public.apply_completed_wallet_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  became_completed boolean;
begin
  became_completed := new.status = 'completed'
    and (tg_op = 'INSERT' or old.status is distinct from 'completed');

  if became_completed then
    if new.direction = 'credit' then
      update public.wallets set balance = balance + new.amount where id = new.wallet_id;
    else
      update public.wallets set balance = balance - new.amount where id = new.wallet_id;
    end if;

    if new.type = 'deposit' then
      insert into public.activity_feed (type, message)
      values ('deposit_completed', 'A member completed a deposit into Trading.');
    elsif new.type = 'withdrawal' then
      insert into public.activity_feed (type, message)
      values ('withdrawal_completed', 'A member completed a withdrawal.');
    end if;
  end if;

  if new.reviewed_by is not null and (tg_op = 'INSERT' or new.status is distinct from old.status) then
    insert into public.admin_actions (admin_id, action, target_user_id, target_transaction_id, meta)
    values (
      new.reviewed_by,
      'wallet_transaction_' || new.status::text,
      new.user_id,
      new.id,
      jsonb_build_object('type', new.type, 'amount', new.amount, 'direction', new.direction)
    );
  end if;

  return new;
end;
$$;

drop trigger if exists apply_completed_wallet_transaction on public.wallet_transactions;
create trigger apply_completed_wallet_transaction
  after insert or update on public.wallet_transactions
  for each row execute function public.apply_completed_wallet_transaction();

-- ---------------------------------------------------------------------------
-- business_selections: AFTER INSERT — anonymized activity feed entry.
-- ---------------------------------------------------------------------------
create or replace function public.log_business_join()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  business_name text;
begin
  select name into business_name from public.business_types where id = new.business_type_id;
  insert into public.activity_feed (type, message)
  values ('business_join', 'A member joined ' || coalesce(business_name, 'a business') || '.');
  return new;
end;
$$;

drop trigger if exists log_business_join on public.business_selections;
create trigger log_business_join
  after insert on public.business_selections
  for each row execute function public.log_business_join();
