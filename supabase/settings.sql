-- ============================================================================
-- REVOLT · Configuración editable desde /admin/configuracion
-- Ejecuta este archivo una vez en Supabase → SQL Editor → New query → Run.
-- Guarda valores sueltos (por ahora el monto del cupón de reserva).
-- Sin políticas de RLS: solo el servidor (service role) lee y escribe.
-- ============================================================================

create table if not exists public.settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.settings enable row level security;
