import type { ReactNode } from "react";
import type { Product } from "@/lib/types/product";
import { availability } from "@/lib/types/product";
import { siteConfig } from "@/lib/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "./ProductGrid";
import { cn } from "@/lib/utils/cn";

/**
 * The store catalogue: heading, stock counter and the filterable grid
 * (Todas / En stock / En camino / Agotadas). Shared by the home page and the
 * SEO landings so both look and behave the same; products are shown in the
 * order they are passed (the home order comes from the repository: featured
 * first, then newest).
 */
export function Catalog({
  products,
  id = "laptops",
  title = siteConfig.home.inventory.title,
  subtitle = siteConfig.home.inventory.subtitle,
  className,
  children,
}: {
  className?: string;
  products: Product[];
  id?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Extra content under the grid (e.g. "Busca por tipo" links). */
  children?: ReactNode;
}) {
  const inStock = products.filter((product) => availability(product) === "in-stock").length;
  const incoming = products.filter((product) => availability(product) === "incoming").length;
  const soldOut = products.length - inStock - incoming;

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-28 space-y-8", className)}>
      <SectionHeading
        id={`${id}-title`}
        title={title}
        subtitle={subtitle}
        aside={
          products.length ? (
            <p className="text-sm font-semibold text-on-surface-variant">
              {inStock} {inStock === 1 ? "equipo" : "equipos"} en stock
              {incoming ? ` · ${incoming} en camino` : ""}
              {soldOut ? ` · ${soldOut} agotadas` : ""}
            </p>
          ) : null
        }
      />
      <ProductGrid products={products} filterable />
      {children}
    </section>
  );
}
