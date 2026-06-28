/**
 * Centralised environment access. `NEXT_PUBLIC_*` values are referenced by their
 * literal name so Next.js can statically inline them into the client bundle.
 * Server-only secrets (service role key, admin password) are NOT prefixed and
 * therefore never reach the browser.
 */

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "",
} as const;

/** Reads (storefront) are possible when the URL + anon key are present. */
export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);

/** Writes (admin CRUD) require the service role key. */
export const isSupabaseAdminConfigured = Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);

/** When false, /admin is left open with a visible warning (dev convenience). */
export const isAdminAuthEnabled = Boolean(env.adminPassword);
