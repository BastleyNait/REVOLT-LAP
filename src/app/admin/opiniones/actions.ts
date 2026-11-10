"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth/admin";
import { deleteReview, setReviewVisibility } from "@/lib/repositories/reviews";

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
