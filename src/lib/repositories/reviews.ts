import "server-only";
import { randomBytes } from "crypto";
import { getAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/env";
import type { ReviewRow } from "@/lib/types/database";
import { siteConfig } from "@/lib/config/site";
import { headers } from "next/headers";

/**
 * Verified reviews. A row starts as an invite when the shipment PDF is made
 * (its token goes in the letter's QR) and becomes a review when the buyer
 * submits /opinar/<token> — once. Every query runs with the service role on
 * the server: tokens never reach the public API.
 */

export const reviewsEnabled = isSupabaseAdminConfigured;

export interface PublicReview {
  id: string;
  rating: number;
  comment: string;
  author: string;
  laptop: string;
  city: string;
  date: string;
}

export interface ReviewSummary {
  count: number;
  average: number;
  items: PublicReview[];
}

const EMPTY: ReviewSummary = { count: 0, average: 0, items: [] };

/** "María Fernanda Quispe" → "María Q." (shown by default; the buyer can edit it). */
export function displayName(full: string): string {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Cliente REVOLT";
  const last = parts.length > 2 ? parts[parts.length - 2] : parts[1];
  return last ? `${parts[0]} ${last[0].toUpperCase()}.` : parts[0];
}

function toPublic(row: ReviewRow): PublicReview {
  return {
    id: row.id,
    rating: row.rating ?? 5,
    comment: row.comment ?? "",
    author: row.author_name || displayName(row.customer_name),
    laptop: row.laptop,
    city: row.city,
    date: row.submitted_at ?? row.created_at,
  };
}

/**
 * Create the invite for an order, or reuse it (same order = same QR, so a
 * reprinted PDF keeps working). Returns its token.
 */
export async function upsertInvite(input: { orderCode: string; customerName: string; laptop: string; city: string }): Promise<string> {
  const db = getAdminClient();
  const { data: existing, error: readError } = await db
    .from("reviews")
    .select("token, submitted_at")
    .eq("order_code", input.orderCode)
    .maybeSingle();
  if (readError) throw readError;

  if (existing) {
    // Details can still be corrected while the buyer hasn't reviewed.
    if (!existing.submitted_at) {
      await db
        .from("reviews")
        .update({ customer_name: input.customerName, laptop: input.laptop, city: input.city })
        .eq("order_code", input.orderCode);
    }
    return existing.token;
  }

  const token = randomBytes(16).toString("base64url");
  const { error } = await db.from("reviews").insert({
    token,
    order_code: input.orderCode,
    customer_name: input.customerName,
    laptop: input.laptop,
    city: input.city,
  });
  if (error) throw error;
  return token;
}

/**
 * Public link of an invite. In production it always uses the live domain:
 * a localhost or preview origin in a customer's QR or WhatsApp would be a
 * dead link.
 */
export function reviewLink(token: string, requestOrigin: string): string {
  const origin = process.env.VERCEL_ENV === "production" ? siteConfig.url : requestOrigin;
  return `${origin}/opinar/${token}`;
}

/**
 * Order code for a purchase made before the shipment app (no PDF, no REV-
 * code). The ANT- prefix never collides with /envios codes (REV-YYMMDD-NNNN),
 * so a future shipment can never reuse one of these invites.
 */
/** Origin of the current request (server actions have no request object). */
export async function requestOrigin(): Promise<string> {
  const head = await headers();
  const host = head.get("x-forwarded-host") ?? head.get("host") ?? "localhost:3000";
  const proto = head.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export function pastPurchaseCode(): string {
  return `ANT-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export async function getInvite(token: string): Promise<ReviewRow | null> {
  if (!reviewsEnabled || !/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  const { data } = await getAdminClient().from("reviews").select("*").eq("token", token).maybeSingle();
  return data ?? null;
}

/** Store the review. Atomic: only succeeds while the invite is still unused. */
export async function submitReview(
  token: string,
  review: { rating: number; comment: string; author: string },
): Promise<"ok" | "used" | "not-found"> {
  const db = getAdminClient();
  const { data, error } = await db
    .from("reviews")
    .update({
      rating: review.rating,
      comment: review.comment,
      author_name: review.author,
      submitted_at: new Date().toISOString(),
    })
    .eq("token", token)
    .is("submitted_at", null)
    .select("id");
  if (error) throw error;
  if (data?.length) return "ok";
  const invite = await getInvite(token);
  return invite ? "used" : "not-found";
}

/** Published reviews for the storefront, newest first, plus the average. */
export async function getPublicReviews(limit = 50): Promise<ReviewSummary> {
  if (!reviewsEnabled) return EMPTY;
  try {
    const { data, error } = await getAdminClient()
      .from("reviews")
      .select("*")
      .not("submitted_at", "is", null)
      .eq("is_visible", true)
      .order("submitted_at", { ascending: false });
    if (error || !data) return EMPTY;
    const count = data.length;
    const average = count ? data.reduce((sum, row) => sum + (row.rating ?? 0), 0) / count : 0;
    return { count, average, items: data.slice(0, limit).map(toPublic) };
  } catch {
    return EMPTY;
  }
}

/** Every invite and review, for the admin. */
export async function listReviewsForAdmin(): Promise<ReviewRow[]> {
  if (!reviewsEnabled) return [];
  const { data } = await getAdminClient().from("reviews").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function setReviewVisibility(id: string, visible: boolean) {
  const { error } = await getAdminClient().from("reviews").update({ is_visible: visible }).eq("id", id);
  if (error) throw error;
}

export async function deleteReview(id: string) {
  const { error } = await getAdminClient().from("reviews").delete().eq("id", id);
  if (error) throw error;
}
