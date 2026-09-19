-- TP Growth Pool — seed data
-- Run automatically by `supabase db reset`. Safe to re-run.
-- Only catalog data is seeded here — never fake users or fake ledger
-- entries. Real members are created by signing in through OTP; promote the
-- first admin manually (see README.md "First admin").

insert into public.business_types (key, name, tagline, is_active, sort_order)
values
  ('trading', 'Trading', 'Participate in Trading Point managed trading pools.', true, 1),
  ('investing', 'Investing', 'Long-horizon portfolio programs. Coming soon.', false, 2),
  ('real_estate', 'Real Estate', 'Property-backed growth pools. Coming soon.', false, 3),
  ('ai_business', 'AI Business', 'AI-operated micro business pools. Coming soon.', false, 4),
  ('digital_marketing', 'Digital Marketing', 'Performance-marketing pools. Coming soon.', false, 5)
on conflict (key) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;
