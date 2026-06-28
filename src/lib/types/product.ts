/**
 * Domain types for the storefront/admin. These are camelCase and decoupled from
 * the snake_case Supabase rows (see ./database.ts). Mapping happens in the
 * products repository.
 */

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  conditionGrade: string;
  processor: string | null;
  ram: string | null;
  storage: string | null;
  display: string | null;
  batteryHealth: string | null;
  description: string | null;
  verdict: string | null;
  /** Free-form extra specs rendered as the "bento" boxes on the detail page. */
  specs: ProductSpec[];
  images: string[];
  /** Marketing chips e.g. "BEST SELLER", "GRADE A". */
  badges: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

/** The cover image, with a deterministic fallback so cards never render empty. */
export function productCover(product: Pick<Product, "images" | "name">): string {
  return product.images[0] ?? PLACEHOLDER_IMAGE;
}

export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'400'%20height%3D'300'%3E%3Crect%20width%3D'400'%20height%3D'300'%20fill%3D'%231b1b1b'%2F%3E%3Ctext%20x%3D'50%25'%20y%3D'50%25'%20fill%3D'%237fffd4'%20font-family%3D'monospace'%20font-size%3D'24'%20font-weight%3D'700'%20text-anchor%3D'middle'%20dominant-baseline%3D'middle'%3ENO%20IMAGE%3C%2Ftext%3E%3C%2Fsvg%3E";
