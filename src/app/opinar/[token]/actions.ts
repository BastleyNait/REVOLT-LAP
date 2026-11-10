"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { submitReview } from "@/lib/repositories/reviews";

export interface ReviewFormState {
  status: "idle" | "ok" | "error";
  message?: string;
}

const clean = (value: string) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

const schema = z.object({
  rating: z.coerce.number().int().min(1, "Elige de 1 a 5 estrellas").max(5),
  comment: z.string().transform(clean).pipe(z.string().max(600, "Máximo 600 caracteres")),
  author: z.string().transform(clean).pipe(z.string().min(2, "Escribe tu nombre").max(40, "Máximo 40 caracteres")),
});

export async function submitReviewAction(token: string, _prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  const parsed = schema.safeParse({
    rating: formData.get("rating"),
    comment: String(formData.get("comment") ?? ""),
    author: String(formData.get("author") ?? ""),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Revisa los datos" };

  try {
    const result = await submitReview(token, parsed.data);
    if (result === "used") return { status: "error", message: "Este código ya se usó para dejar una opinión." };
    if (result === "not-found") return { status: "error", message: "Este enlace no es válido." };
  } catch (error) {
    console.error("submit review", error);
    return { status: "error", message: "No pudimos guardar tu opinión. Inténtalo de nuevo en unos minutos." };
  }

  revalidatePath("/");
  revalidatePath("/opiniones");
  return { status: "ok" };
}
