import "server-only";
import { unstable_cache } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { siteConfig } from "@/lib/config/site";

/**
 * Store settings editable from /admin/configuracion (table public.settings).
 * Every read falls back to the value in siteConfig, so the store keeps working
 * when Supabase or the table isn't there.
 */

export const SETTINGS_TAG = "settings";
const COUPON_KEY = "reservation_coupon_pen";

/** Allowed range for the reservation coupon, in soles. */
export const COUPON_MIN = 10;
export const COUPON_MAX = 1000;

export const DEFAULT_COUPON_PEN = siteConfig.reservation.couponPen;

async function readCoupon(): Promise<{ value: number; source: "db" | "default"; updatedAt: string | null; error?: string }> {
  if (!isSupabaseAdminConfigured) return { value: DEFAULT_COUPON_PEN, source: "default", updatedAt: null, error: "Supabase no está configurado" };
  try {
    const { data, error } = await getAdminClient().from("settings").select("value, updated_at").eq("key", COUPON_KEY).maybeSingle();
    if (error) return { value: DEFAULT_COUPON_PEN, source: "default", updatedAt: null, error: error.message };
    const n = Number(data?.value);
    if (!data || !Number.isFinite(n) || n < COUPON_MIN || n > COUPON_MAX) return { value: DEFAULT_COUPON_PEN, source: "default", updatedAt: null };
    return { value: Math.round(n), source: "db", updatedAt: data.updated_at };
  } catch (e) {
    return { value: DEFAULT_COUPON_PEN, source: "default", updatedAt: null, error: (e as Error).message };
  }
}

/** Reservation coupon in soles (cached; refreshed when the admin saves). */
export const getCouponPen = unstable_cache(async () => (await readCoupon()).value, ["reservation-coupon-pen"], {
  tags: [SETTINGS_TAG],
  // Refreshed by tag when the admin saves; this is only a safety net.
  revalidate: 86400,
});

/** Uncached, with where the value comes from (for the admin page). */
export const getCouponSetting = readCoupon;

export async function saveCouponPen(value: number): Promise<void> {
  const { error } = await getAdminClient()
    .from("settings")
    .upsert({ key: COUPON_KEY, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}
