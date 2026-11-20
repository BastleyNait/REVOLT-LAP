import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/env";
import type { ComplaintRow, Database } from "@/lib/types/database";

export const complaintsEnabled = isSupabaseAdminConfigured;

export type ComplaintInput = Database["public"]["Tables"]["complaints"]["Insert"];

/** Sheet code shown to the consumer, e.g. LR-2026-000012. */
export function complaintCode(row: Pick<ComplaintRow, "number" | "created_at">): string {
  return `LR-${new Date(row.created_at).getUTCFullYear()}-${String(row.number).padStart(6, "0")}`;
}

/** 15 business days (Mon–Fri) after the complaint: the legal answer deadline. */
export function answerDeadline(createdAt: string): Date {
  const d = new Date(createdAt);
  let left = 15;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) left--;
  }
  return d;
}

export async function createComplaint(input: ComplaintInput): Promise<ComplaintRow> {
  const { data, error } = await getAdminClient().from("complaints").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function getComplaint(id: string): Promise<ComplaintRow | null> {
  if (!complaintsEnabled || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await getAdminClient().from("complaints").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function listComplaints(): Promise<ComplaintRow[]> {
  if (!complaintsEnabled) return [];
  const { data } = await getAdminClient().from("complaints").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function respondComplaint(id: string, response: string): Promise<void> {
  const { error } = await getAdminClient()
    .from("complaints")
    .update({ status: "respondido", response, responded_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
