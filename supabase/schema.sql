-- ============================================================================
-- REVOLT — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`) before seeding.
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  brand           text not null,
  price           numeric(10, 2) not null default 0,
  original_price  numeric(10, 2),
  currency        text not null default 'USD',
  condition_grade text not null default 'REFURBISHED',
  processor       text,
  ram             text,
  storage         text,
  display         text,
  battery_health  text,
  description     text,
  verdict         text,
  specs           jsonb not null default '[]'::jsonb,
  images          jsonb not null default '[]'::jsonb,
  badges          jsonb not null default '[]'::jsonb,
  stock           integer not null default 0,
  is_active       boolean not null default true,
  is_featured     boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists products_active_idx   on public.products (is_active);
create index if not exists products_featured_idx on public.products (is_featured);
create index if not exists products_created_idx  on public.products (created_at desc);

-- Keep updated_at fresh on every update.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- Storefront uses the ANON key => may only read active products.
-- Admin API uses the SERVICE ROLE key => bypasses RLS for writes.
-- (Intentionally no insert/update/delete policies for anon/authenticated.)
-- ----------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "Public read active products" on public.products;
create policy "Public read active products"
  on public.products
  for select
  using (is_active = true);
