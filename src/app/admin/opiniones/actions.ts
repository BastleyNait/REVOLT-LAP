"use server";

import { revalidatePath } from "next/cache";
import QRCode from "qrcode";
import { z } from "zod";
import { isAuthed } from "@/lib/auth/admin";
import {
  deleteReview,
  pastPurchaseCode,
  requestOrigin,
  reviewLink,
  reviewsEnabled,
  setReviewVisibility,
  upsertInvite,
} from "@/lib/repositories/reviews";

async function refresh() {
  revalidatePath("/admin/opiniones");
  revalidatePath("/");
  revalidatePath("/opiniones");
}

export async function toggleReviewAction(formData: FormData) {
  if (!(await isAuthed())) return;
  await setReviewVisibility(String(formData.get("id")), formData.get("visible") === "true");
  await refresh();
}

export async function deleteReviewAction(formData: FormData) {
  if (!(await isAuthed())) return;
  await deleteReview(String(formData.get("id")));
  await refresh();
}

export type PastInviteState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok"; url: string; qrSvg: string; customerName: string; laptop: string; orderCode: string };

const pastInviteSchema = z.object({
  customerName: z.string().trim().min(1, "Falta el nombre del cliente").max(120),
  laptop: z.string().trim().max(160).default(""),
  city: z.string().trim().max(120).default(""),
});

/**
 * Enlace único de opinión para un cliente de una compra anterior (sin PDF
 * de envío): el mismo tipo de enlace de un solo uso que el QR de la carta.
 */
export async function createPastInviteAction(_prev: PastInviteState, formData: FormData): Promise<PastInviteState> {
  if (!(await isAuthed())) return { status: "error", message: "Sesión vencida, vuelve a entrar al admin." };
  if (!reviewsEnabled) return { status: "error", message: "Supabase no está configurado en este entorno." };

  const parsed = pastInviteSchema.safeParse({
    customerName: formData.get("customerName") ?? "",
    laptop: formData.get("laptop") ?? "",
    city: formData.get("city") ?? "",
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  try {
    const orderCode = pastPurchaseCode();
    const token = await upsertInvite({ orderCode, ...parsed.data });
    const url = reviewLink(token, await requestOrigin());
    const qrSvg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 1 });
    revalidatePath("/admin/opiniones");
    return { status: "ok", url, qrSvg, customerName: parsed.data.customerName, laptop: parsed.data.laptop, orderCode };
  } catch (error) {
    console.error("past review invite", error);
    return { status: "error", message: "No se pudo crear el enlace. ¿Ejecutaste supabase/reviews.sql en Supabase?" };
  }
}
