"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { isAuthed } from "@/lib/auth/admin";
import { COUPON_MAX, COUPON_MIN, SETTINGS_TAG, saveCouponPen } from "@/lib/repositories/settings";

export interface CouponFormState {
  status: "idle" | "ok" | "error";
  message?: string;
}

export async function saveCouponAction(_prev: CouponFormState, formData: FormData): Promise<CouponFormState> {
  if (!(await isAuthed())) return { status: "error", message: "No autorizado" };
  const value = Number(String(formData.get("couponPen") ?? "").replace(",", "."));
  if (!Number.isInteger(value) || value < COUPON_MIN || value > COUPON_MAX) {
    return { status: "error", message: `Escribe un monto entero entre S/ ${COUPON_MIN} y S/ ${COUPON_MAX}.` };
  }
  try {
    await saveCouponPen(value);
  } catch (error) {
    console.error("save coupon", error);
    return { status: "error", message: "No se pudo guardar. ¿Ejecutaste supabase/settings.sql en Supabase?" };
  }
  // Every page that shows the coupon (cards, product pages, toasts) refreshes now.
  revalidateTag(SETTINGS_TAG, "max");
  revalidatePath("/", "layout");
  return { status: "ok", message: `Listo: el cupón ahora es de S/ ${value}.` };
}
