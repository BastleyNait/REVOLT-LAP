import { getProducts } from "@/lib/repositories/products";
import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/product/ProductGrid";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="relative flex-1">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-[0.03]" />
      <div className="mx-auto max-w-[1440px] space-y-24 px-4 py-12 md:px-margin-edge md:py-20">
        <Hero />

        <section id="inventario" className="scroll-mt-28 space-y-12">
          <div className="flex items-center gap-6">
            <h2 className="inline-block -rotate-2 bg-on-background px-6 py-2 font-display-lg text-headline-lg font-black uppercase text-surface md:text-display-lg">
              {siteConfig.home.inventoryHeading}
            </h2>
            <div className="mt-2 h-1.5 flex-grow bg-on-background" />
          </div>

          <ProductGrid products={products} />
        </section>
      </div>
    </main>
  );
}
