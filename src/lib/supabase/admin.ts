import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { env, isSupabaseAdminConfigured } from "@/lib/env";

let cached: SupabaseClient<Database> | null = null;

/**
 * Service-role Supabase client for privileged writes (admin CRUD). Bypasses
 * RLS, so it MUST only ever run on the server — the `server-only` import makes
 * the build fail if it's accidentally imported into a client component.
 */
export function getAdminClient(): SupabaseClient<Database> {
  if (!isSupabaseAdminConfigured) {
    throw new Error(
      "Supabase admin client unavailable. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  if (!cached) {
    cached = createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
