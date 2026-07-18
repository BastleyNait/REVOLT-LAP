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
  values?: Record<string, any>;
}

function zodToFieldErrors(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

function extractFormValues(formData: FormData): Record<string, any> {
  return {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    brand: formData.get("brand") as string,
    price: formData.get("price") as string,
    originalPrice: formData.get("originalPrice") as string,
    currency: formData.get("currency") as string,
    conditionGrade: formData.get("conditionGrade") as string,
    processor: formData.get("processor") as string,
    ram: formData.get("ram") as string,
    storage: formData.get("storage") as string,
    display: formData.get("display") as string,
    batteryHealth: formData.get("batteryHealth") as string,
    description: formData.get("description") as string,
    verdict: formData.get("verdict") as string,
    images: formData.get("images") as string,
    badges: formData.get("badges") as string,
    specs: formData.get("specs") as string,
    stock: formData.get("stock") as string,
    isActive: formData.get("isActive") !== null,
    isFeatured: formData.get("isFeatured") !== null,
  };
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
    return { ok: false, error: "Revisa los campos marcados.", fieldErrors: zodToFieldErrors(parsed.error), values: extractFormValues(formData) };
  }

  try {
    await createProduct(parsed.data);
  } catch (error) {
    return { ok: false, error: (error as Error).message, values: extractFormValues(formData) };
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
    return { ok: false, error: "Revisa los campos marcados.", fieldErrors: zodToFieldErrors(parsed.error), values: extractFormValues(formData) };
  }

  try {
    await updateProduct(id, parsed.data);
  } catch (error) {
    return { ok: false, error: (error as Error).message, values: extractFormValues(formData) };
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
