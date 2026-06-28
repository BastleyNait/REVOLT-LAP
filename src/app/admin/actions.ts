"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { productInputFromFormData, productInputSchema } from "@/lib/validators/product";
import { createProduct, deleteProduct, updateProduct } from "@/lib/repositories/products";
import { isAuthed } from "@/lib/auth/admin";
import { ADMIN_COOKIE } from "@/lib/auth/token";

export interface ActionState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function zodToFieldErrors(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/products/${slug}`);
}

export async function createProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado. Inicia sesión de nuevo." };

  const parsed = productInputSchema.safeParse(productInputFromFormData(formData));
  if (!parsed.success) {
    return { ok: false, error: "Revisa los campos marcados.", fieldErrors: zodToFieldErrors(parsed.error) };
  }

  try {
    await createProduct(parsed.data);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  revalidateStorefront(parsed.data.slug);
  redirect("/admin?status=created");
}

export async function updateProductAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado. Inicia sesión de nuevo." };

  const parsed = productInputSchema.safeParse(productInputFromFormData(formData));
  if (!parsed.success) {
    return { ok: false, error: "Revisa los campos marcados.", fieldErrors: zodToFieldErrors(parsed.error) };
  }

  try {
    await updateProduct(id, parsed.data);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  revalidateStorefront(parsed.data.slug);
  redirect("/admin?status=updated");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login?redirect=/admin");

  const id = String(formData.get("id") ?? "");
  if (id) {
    try {
      await deleteProduct(id);
    } catch {
      redirect("/admin?status=delete-error");
    }
  }

  revalidateStorefront();
  redirect("/admin?status=deleted");
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
