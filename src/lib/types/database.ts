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

/** One sheet of the virtual Libro de Reclamaciones. */
export type ComplaintRow = {
  id: string;
  number: number;
  created_at: string;
  kind: "reclamo" | "queja";
  full_name: string;
  doc_type: string;
  doc_number: string;
  address: string;
  phone: string;
  email: string;
  is_minor: boolean;
  guardian_name: string | null;
  item_type: "producto" | "servicio";
  item_description: string;
  amount: number | null;
  order_code: string | null;
  detail: string;
  request: string;
  status: "pendiente" | "respondido";
  response: string | null;
  responded_at: string | null;
};

/** Verified review. Starts as an invite (no rating) when a shipment PDF is made. */
export type ReviewRow = {
  id: string;
  token: string;
  order_code: string;
  customer_name: string;
  laptop: string;
  city: string;
  rating: number | null;
  comment: string | null;
  author_name: string | null;
  submitted_at: string | null;
  is_visible: boolean;
  created_at: string;
};

export type ProductInsert = Omit<ProductRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      complaints: {
        Row: ComplaintRow;
        Insert: Omit<ComplaintRow, "id" | "number" | "created_at" | "status" | "response" | "responded_at">;
        Update: Partial<Pick<ComplaintRow, "status" | "response" | "responded_at">>;
        Relationships: [];
      };
      settings: {
        Row: { key: string; value: unknown; updated_at: string };
        Insert: { key: string; value: unknown; updated_at?: string };
        Update: { value?: unknown; updated_at?: string };
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow;
        Insert: Partial<ReviewRow> & Pick<ReviewRow, "token" | "order_code" | "customer_name">;
        Update: Partial<ReviewRow>;
        Relationships: [];
      };
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
