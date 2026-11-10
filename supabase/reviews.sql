-- ============================================================================
-- REVOLT · Opiniones verificadas
-- Ejecuta este archivo una vez en Supabase → SQL Editor → New query → Run.
--
-- Cada fila nace como una INVITACIÓN cuando generas el PDF de un envío en
-- /envios (token único en el QR de la carta). Cuando el cliente la usa en
-- /opinar/<token>, se completan rating, comment y submitted_at. El token
-- sirve una sola vez.
--
-- Sin políticas de RLS a propósito: solo el servidor (service role) lee y
-- escribe, así los tokens nunca quedan expuestos con la clave pública.
-- ============================================================================

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
