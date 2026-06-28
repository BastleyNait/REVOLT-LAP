import { z } from "zod";
import { linesToArray, slugify } from "@/lib/utils/format";

export const productSpecSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

/**
 * Canonical product input schema (camelCase domain shape). Numbers are coerced
 * so the same schema validates both JSON API bodies and parsed form data.
 */
export const productInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().nonnegative("Price must be 0 or more"),
  originalPrice: z.coerce.number().nonnegative().nullable().optional(),
  currency: z.string().min(1).default("USD"),
  conditionGrade: z.string().min(1).default("REFURBISHED"),
  processor: z.string().nullable().optional(),
  ram: z.string().nullable().optional(),
  storage: z.string().nullable().optional(),
  display: z.string().nullable().optional(),
  batteryHealth: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  verdict: z.string().nullable().optional(),
  specs: z.array(productSpecSchema).default([]),
  images: z.array(z.string().min(1)).default([]),
  badges: z.array(z.string().min(1)).default([]),
  stock: z.coerce.number().int().nonnegative().default(0),
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
    currency: str("currency") || "USD",
    conditionGrade: str("conditionGrade") || "REFURBISHED",
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
