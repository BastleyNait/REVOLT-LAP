import type { Product } from "@/lib/types/product";
import type { ProductInsert, ProductRow } from "@/lib/types/database";
import type { ProductInput } from "@/lib/validators/product";
import { getPublicClient } from "@/lib/supabase/client";
import { getAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/env";
import {
  fallbackProducts,
  findFallbackById,
  findFallbackBySlug,
} from "@/lib/data/fallback-products";

/**
 * Single data-access layer for products. Every page, server action and API
 * route goes through here — nothing talks to Supabase directly. When Supabase
 * isn't configured, reads transparently fall back to the demo catalogue.
 */

const TABLE = "products" as const;

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : null,
    currency: row.currency,
    conditionGrade: row.condition_grade,
    processor: row.processor,
    ram: row.ram,
    storage: row.storage,
    display: row.display,
    batteryHealth: row.battery_health,
    description: row.description,
    verdict: row.verdict,
    specs: row.specs ?? [],
    images: row.images ?? [],
    badges: row.badges ?? [],
    stock: row.stock,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function inputToInsert(input: ProductInput): ProductInsert {
  return {
    slug: input.slug,
    name: input.name,
    brand: input.brand,
    price: input.price,
    original_price: input.originalPrice ?? null,
    currency: input.currency,
    condition_grade: input.conditionGrade,
    processor: input.processor ?? null,
    ram: input.ram ?? null,
    storage: input.storage ?? null,
    display: input.display ?? null,
    battery_health: input.batteryHealth ?? null,
    description: input.description ?? null,
    verdict: input.verdict ?? null,
    specs: input.specs,
    images: input.images,
    badges: input.badges,
    stock: input.stock,
    is_active: input.isActive,
    is_featured: input.isFeatured,
  };
}

/* ----------------------------- Reads (public) ---------------------------- */

/** Active products for the storefront, featured first. */
export async function getProducts(): Promise<Product[]> {
  const supabase = getPublicClient();
  if (!supabase) return fallbackProducts.filter((p) => p.isActive);

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data ?? []).map(rowToProduct);
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const products = await getProducts();
  const featured = products.filter((p) => p.isFeatured);
  return (featured.length > 0 ? featured : products).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getPublicClient();
  if (!supabase) return findFallbackBySlug(slug);

  const { data, error } = await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return data ? rowToProduct(data) : null;
}

/** Slugs for static params / sitemap generation. */
export async function getAllSlugs(): Promise<string[]> {
  const supabase = getPublicClient();
  if (!supabase) return fallbackProducts.map((p) => p.slug);

  const { data, error } = await supabase.from(TABLE).select("slug").eq("is_active", true);
  if (error) throw new Error(`Failed to load slugs: ${error.message}`);
  return (data ?? []).map((row) => row.slug);
}

/* ------------------------- Reads (admin, all rows) ----------------------- */

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (!isSupabaseAdminConfigured) return [...fallbackProducts];

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data ?? []).map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseAdminConfigured) return findFallbackById(id);

  const supabase = getAdminClient();
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return data ? rowToProduct(data) : null;
}

/* ----------------------------- Writes (admin) ---------------------------- */

export async function createProduct(input: ProductInput): Promise<Product> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(inputToInsert(input))
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return rowToProduct(data);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...inputToInsert(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return rowToProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Whether storefront reads are hitting Supabase (vs. fallback demo data). */
export function isUsingLiveData(): boolean {
  return isSupabaseConfigured;
}
