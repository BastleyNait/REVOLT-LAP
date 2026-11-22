"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth/admin";
import { randomBytes } from "crypto";
import QRCode from "qrcode";
import { siteConfig } from "@/lib/config/site";
import { deleteReview, setReviewVisibility, upsertInvite } from "@/lib/repositories/reviews";
import { getProductById, markProductSoldOut } from "@/lib/repositories/products";
import { availability } from "@/lib/types/product";

async function refresh() {
  revalidatePath("/admin/opiniones");
  // Reviews show on the home, /opiniones and /nuestros-envios.
  revalidatePath("/", "layout");
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

export interface LocalInviteState {
  status: "idle" | "ok" | "error";
  message?: string;
  url?: string;
  qrSvg?: string;
  customerName?: string;
  laptop?: string;
  markedSoldOut?: boolean;
}

/**
 * One-time review link for an in-person sale (no shipment PDF, so no letter
 * with QR). The laptop is picked from the catalogue; the link works once and
 * the review shows as "Compra verificada", like the ones from /envios.
 */
export async function createLocalInviteAction(_prev: LocalInviteState, formData: FormData): Promise<LocalInviteState> {
  if (!(await isAuthed())) return { status: "error", message: "No autorizado" };
  const customerName = String(formData.get("customerName") ?? "").trim().slice(0, 120);
  const picked = String(formData.get("laptop") ?? "");
  const other = String(formData.get("laptopOther") ?? "").trim();
  const product = picked && picked !== "__other__" ? await getProductById(picked) : null;
  const laptop = (picked === "__other__" ? other : (product?.name ?? "")).slice(0, 160);
  const city = String(formData.get("city") ?? "").trim().slice(0, 120) || "Arequipa";
  if (customerName.length < 2) return { status: "error", message: "Escribe el nombre del cliente" };
  if (!laptop) return { status: "error", message: "Elige la laptop vendida" };

  const stamp = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date()).replace(/-/g, "").slice(2);
  const orderCode = `ARQ-${stamp}-${randomBytes(2).toString("hex").toUpperCase()}`;
  try {
    const token = await upsertInvite({ orderCode, customerName, laptop, city });
    const url = `${siteConfig.url}/opinar/${token}`;
    const qrSvg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 1 });
    // Sold in person: the laptop stays listed, but as sold out (stock 0, no longer "en camino").
    let markedSoldOut = false;
    if (product && availability(product) !== "sold-out") {
      await markProductSoldOut(product.id);
      markedSoldOut = true;
      revalidatePath("/", "layout");
    }
    revalidatePath("/admin/opiniones");
    return { status: "ok", url, qrSvg, customerName, laptop, markedSoldOut };
  } catch (error) {
    console.error("local invite", error);
    return { status: "error", message: "No se pudo crear el enlace. Inténtalo de nuevo." };
  }
}
