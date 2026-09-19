-- TP Growth Pool — 0001: extensions & enums
-- Safe to re-run: every statement is guarded.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('user', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.account_status as enum ('active', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.transaction_type as enum ('deposit', 'withdrawal', 'adjustment');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.transaction_direction as enum ('credit', 'debit');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.transaction_status as enum ('pending', 'completed', 'rejected', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.business_selection_status as enum ('active', 'inactive');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.activity_type as enum (
    'signup',
    'business_join',
    'deposit_completed',
    'withdrawal_completed'
  );
exception when duplicate_object then null; end $$;
