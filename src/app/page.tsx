import { getProducts } from "@/lib/repositories/products";
import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/product/ProductGrid";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="relative flex-1">
      {/* Hero — full-width, outside the max-w container */}
      <Hero />

      <div className="mx-auto max-w-[1200px] space-y-24 px-4 py-10 md:px-8 md:py-16">
        <section id="inventario" className="scroll-mt-28 space-y-10">
          <div className="space-y-2 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {siteConfig.home.inventoryHeading}
            </p>
            <h2 className="font-display-lg text-4xl font-black tracking-tight md:text-5xl">
              Equipos disponibles
            </h2>
          </div>

          <ProductGrid products={products} />
        </section>
      </div>
    </main>
  );
}
