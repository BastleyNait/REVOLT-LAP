import { z } from "zod";
import { linesToArray, slugify } from "@/lib/utils/format";
import { DEFAULT_CONDITION } from "@/lib/types/product";

export const productSpecSchema = z.object({
  label: z.string().min(1, "La etiqueta es obligatoria"),
  value: z.string().min(1, "El valor es obligatorio"),
});

/**
 * Canonical product input schema (camelCase domain shape). Numbers are coerced
 * so the same schema validates both JSON API bodies and parsed form data.
 */
export const productInputSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z
    .string()
    .min(2, "La URL (slug) es obligatoria")
    .regex(/^[a-z0-9-]+$/, "Usa solo minúsculas, números y guiones"),
  brand: z.string().min(1, "La marca es obligatoria"),
  price: z.coerce.number({ invalid_type_error: "Ingresa un precio válido" }).nonnegative("El precio debe ser 0 o más"),
  originalPrice: z.coerce.number({ invalid_type_error: "Ingresa un precio válido" }).nonnegative("El precio debe ser 0 o más").nullable().optional(),
  currency: z.string().min(1, "La moneda es obligatoria").default("PEN"),
  conditionGrade: z.string().min(1, "Indica el estado del equipo").default(DEFAULT_CONDITION),
  processor: z.string().nullable().optional(),
  ram: z.string().nullable().optional(),
  storage: z.string().nullable().optional(),
  display: z.string().nullable().optional(),
  batteryHealth: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  verdict: z.string().nullable().optional(),
  specs: z.array(productSpecSchema).default([]),
  images: z.array(z.string().min(1, "URL de imagen vacía")).default([]),
  badges: z.array(z.string().min(1, "Etiqueta vacía")).default([]),
  stock: z.coerce.number({ invalid_type_error: "Ingresa un número" }).int("El stock debe ser un número entero").nonnegative("El stock debe ser 0 o más").default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productInputSchema>;

/**
 * Translate an admin <form> submission into the raw object expected by
 * `productInputSchema`. Arrays are entered one-per-line; specs use "Label: Value".
 */
export function productInputFromFormData(formData: FormData): Record<string, unknown> {
  const str = (key: string): string => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  const name = str("name");
  const originalPrice = str("originalPrice");

  const specs = linesToArray(str("specs"))
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return { label: line, value: "" };
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    })
    .filter((spec) => spec.label && spec.value);

  return {
    name,
    slug: str("slug") || slugify(name),
    brand: str("brand"),
    price: str("price") || "0",
    originalPrice: originalPrice === "" ? null : originalPrice,
    currency: str("currency") || "PEN",
    conditionGrade: str("conditionGrade") || DEFAULT_CONDITION,
    processor: str("processor") || null,
    ram: str("ram") || null,
    storage: str("storage") || null,
    display: str("display") || null,
    batteryHealth: str("batteryHealth") || null,
    description: str("description") || null,
    verdict: str("verdict") || null,
    specs,
    images: linesToArray(str("images")),
    badges: linesToArray(str("badges")),
    stock: str("stock") || "0",
    isActive: formData.get("isActive") != null,
    isFeatured: formData.get("isFeatured") != null,
  };
}
