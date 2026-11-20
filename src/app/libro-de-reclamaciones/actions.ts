"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { complaintsEnabled, createComplaint } from "@/lib/repositories/complaints";

export interface ComplaintFormState {
  status: "idle" | "error";
  message?: string;
  fields?: Record<string, string>;
}

const clean = (v: unknown) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
const text = (min: number, max: number, msg: string) => z.string().transform(clean).pipe(z.string().min(min, msg).max(max, `${msg} (máximo ${max} caracteres)`));

const schema = z
  .object({
    kind: z.enum(["reclamo", "queja"], { errorMap: () => ({ message: "Elige si es un reclamo o una queja" }) }),
    full_name: text(3, 120, "Escribe tu nombre completo"),
    doc_type: z.enum(["DNI", "CE", "Pasaporte", "RUC"]),
    doc_number: text(6, 15, "Escribe tu número de documento"),
    address: text(5, 200, "Escribe tu domicilio"),
    phone: text(6, 20, "Escribe tu teléfono"),
    email: z.string().transform(clean).pipe(z.string().email("Escribe un correo válido").max(120)),
    is_minor: z.boolean(),
    guardian_name: z.string().transform(clean),
    item_type: z.enum(["producto", "servicio"]),
    item_description: text(3, 200, "Describe el producto o servicio"),
    amount: z.string().transform(clean),
    order_code: z.string().transform(clean).pipe(z.string().max(40)),
    detail: text(10, 2000, "Cuéntanos el detalle (al menos 10 caracteres)"),
    request: text(5, 1000, "Escribe tu pedido"),
    accept: z.literal(true, { errorMap: () => ({ message: "Confirma que los datos son correctos" }) }),
  })
  .refine((d) => !d.is_minor || d.guardian_name.length >= 3, { message: "Escribe el nombre del padre, madre o apoderado", path: ["guardian_name"] })
  .refine((d) => !d.amount || (Number(d.amount.replace(",", ".")) >= 0 && Number.isFinite(Number(d.amount.replace(",", ".")))), { message: "El monto debe ser un número", path: ["amount"] });

export async function submitComplaintAction(_prev: ComplaintFormState, formData: FormData): Promise<ComplaintFormState> {
  const raw = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""]));
  const parsed = schema.safeParse({ ...raw, is_minor: formData.get("is_minor") === "on", accept: formData.get("accept") === "on" });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Revisa los datos", fields: raw };
  if (!complaintsEnabled) return { status: "error", message: "El libro no está disponible en este momento. Escríbenos por WhatsApp.", fields: raw };

  const d = parsed.data;
  let id: string;
  try {
    const row = await createComplaint({
      kind: d.kind,
      full_name: d.full_name,
      doc_type: d.doc_type,
      doc_number: d.doc_number,
      address: d.address,
      phone: d.phone,
      email: d.email,
      is_minor: d.is_minor,
      guardian_name: d.is_minor ? d.guardian_name : null,
      item_type: d.item_type,
      item_description: d.item_description,
      amount: d.amount ? Number(d.amount.replace(",", ".")) : null,
      order_code: d.order_code || null,
      detail: d.detail,
      request: d.request,
    });
    id = row.id;
  } catch (error) {
    console.error("complaint", error);
    return { status: "error", message: "No pudimos registrar tu hoja. Inténtalo de nuevo en unos minutos.", fields: raw };
  }
  redirect(`/libro-de-reclamaciones/${id}`);
}
