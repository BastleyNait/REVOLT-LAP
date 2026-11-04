import type { Product } from "@/lib/types/product";
import { availability } from "@/lib/types/product";
import { ProductCard } from "./ProductCard";
import { CatalogFilter } from "./CatalogFilter";
import { siteConfig } from "@/lib/config/site";

/**
 * Server-rendered catalogue grid. Functional UI: no scroll animations.
 * `filterable` adds the availability filter (home page catalogue).
 */
export function ProductGrid({ products, filterable = false }: { products: Product[]; filterable?: boolean }) {
  if (products.length === 0) {
    return (
      <div className="glass rounded-3xl p-12 text-center">
        <p className="text-lg font-semibold text-on-surface-variant">{siteConfig.home.inventory.empty}</p>
      </div>
    );
  }

  if (filterable) {
    return (
      <CatalogFilter
        items={products.map((product) => ({
          id: product.id,
          availability: availability(product),
          card: <ProductCard product={product} />,
        }))}
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id} className="h-full">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
