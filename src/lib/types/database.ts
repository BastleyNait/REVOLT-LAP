import type { ProductSpec } from "./product";

/**
 * Minimal Supabase schema typing for the `products` table, used to type the
 * supabase-js client. Declared with `type` (not `interface`) so it satisfies
 * supabase-js's `Record<string, ...>` schema constraints. Keep in sync with
 * supabase/schema.sql.
 */

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  original_price: number | null;
  currency: string;
  condition_grade: string;
  processor: string | null;
  ram: string | null;
  storage: string | null;
  display: string | null;
  battery_health: string | null;
  description: string | null;
  verdict: string | null;
  specs: ProductSpec[] | null;
  images: string[] | null;
  badges: string[] | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductInsert = Omit<ProductRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: Partial<ProductInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
