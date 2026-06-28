import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { env, isSupabaseConfigured } from "@/lib/env";

let cached: SupabaseClient<Database> | null = null;

/**
 * Anon/public Supabase client used for reads (subject to RLS). Returns `null`
 * when Supabase isn't configured yet, so callers can fall back to demo data.
 * Safe to use in both server and browser contexts.
 */
export function getPublicClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
