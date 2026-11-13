"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { reviewsEnabled, submitOpenReview } from "@/lib/repositories/reviews";
import type { ReviewFormState } from "@/app/opinar/[token]/actions";

const clean = (value: string) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

const schema = z.object({
  rating: z.coerce.number().int().min(1, "Elige de 1 a 5 estrellas").max(5),
  comment: z.string().transform(clean).pipe(z.string().max(600, "Máximo 600 caracteres")),
  author: z.string().transform(clean).pipe(z.string().min(2, "Escribe tu nombre").max(40, "Máximo 40 caracteres")),
  laptop: z.string().transform(clean).pipe(z.string().max(160, "Máximo 160 caracteres")),
});

/** Opinión desde el enlace general: queda oculta hasta que la apruebes en el admin. */
export async function submitOpenReviewAction(_prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  // Campo trampa: invisible para personas, los bots lo llenan.
  if (String(formData.get("website") ?? "")) return { status: "ok" };
  if (!reviewsEnabled) return { status: "error", message: "Las opiniones no están disponibles en este momento." };

  const parsed = schema.safeParse({
    rating: formData.get("rating"),
    comment: String(formData.get("comment") ?? ""),
    author: String(formData.get("author") ?? ""),
    laptop: String(formData.get("laptop") ?? ""),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Revisa los datos" };

  try {
    await submitOpenReview(parsed.data);
  } catch (error) {
    console.error("open review", error);
    return { status: "error", message: "No pudimos guardar tu opinión. Inténtalo de nuevo en unos minutos." };
  }

  revalidatePath("/admin/opiniones");
  return { status: "ok" };
}
