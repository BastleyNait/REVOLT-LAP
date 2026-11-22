"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth/admin";
import { respondComplaint } from "@/lib/repositories/complaints";

export async function respondComplaintAction(formData: FormData) {
  if (!(await isAuthed())) return;
  const id = String(formData.get("id") ?? "");
  const response = String(formData.get("response") ?? "").trim();
  if (!id || response.length < 5) return;
  await respondComplaint(id, response.slice(0, 3000));
  revalidatePath("/admin/reclamos");
}
