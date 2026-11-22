-- ============================================================================
-- REVOLT · Libro de Reclamaciones virtual (/libro-de-reclamaciones)
-- Ejecuta este archivo una vez en Supabase → SQL Editor → New query → Run.
-- Cada fila es una hoja de reclamación; `number` da el correlativo.
-- Sin políticas de RLS: solo el servidor (service role) lee y escribe.
-- ============================================================================

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
