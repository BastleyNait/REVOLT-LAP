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
  currency        text not null default 'PEN',
  condition_grade text not null default 'Reacondicionada',
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

-- ----------------------------------------------------------------------------
-- Opiniones verificadas (QR único en la carta de cada envío).
-- Mismo contenido que supabase/reviews.sql.
-- ----------------------------------------------------------------------------

create extension if not exists "pgcrypto";

create table if not exists public.reviews (
  id             uuid primary key default gen_random_uuid(),
  token          text not null unique,
  order_code     text not null unique,
  customer_name  text not null,
  laptop         text not null default '',
  city           text not null default '',
  rating         smallint check (rating between 1 and 5),
  comment        text,
  author_name    text,
  submitted_at   timestamptz,
  is_visible     boolean not null default true,
  created_at     timestamptz not null default now()
);

create index if not exists reviews_public_idx on public.reviews (submitted_at desc) where submitted_at is not null and is_visible;

alter table public.reviews enable row level security;

-- ----------------------------------------------------------------------------
-- Configuración editable desde el admin (mismo contenido que supabase/settings.sql).
-- ----------------------------------------------------------------------------
create table if not exists public.settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.settings enable row level security;

-- ----------------------------------------------------------------------------
-- Libro de Reclamaciones (mismo contenido que supabase/complaints.sql).
-- ----------------------------------------------------------------------------
create table if not exists public.complaints (
  id               uuid primary key default gen_random_uuid(),
  number           bigint generated always as identity unique,
  created_at       timestamptz not null default now(),
  kind             text not null check (kind in ('reclamo', 'queja')),
  full_name        text not null,
  doc_type         text not null default 'DNI',
  doc_number       text not null,
  address          text not null,
  phone            text not null,
  email            text not null,
  is_minor         boolean not null default false,
  guardian_name    text,
  item_type        text not null check (item_type in ('producto', 'servicio')),
  item_description text not null,
  amount           numeric(10, 2),
  order_code       text,
  detail           text not null,
  request          text not null,
  status           text not null default 'pendiente' check (status in ('pendiente', 'respondido')),
  response         text,
  responded_at     timestamptz
);

create index if not exists complaints_created_idx on public.complaints (created_at desc);

alter table public.complaints enable row level security;
