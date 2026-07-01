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

      {/*
       * Transición hero → catálogo.
       * El problema del gradiente negro→transparente es que el body tiene
       * background-color AMOLED negro, así que "transparente" sigue siendo negro.
       * Solución: un pulso verde radial que emerge de la oscuridad —
       * el mismo verde del brand, visible contra el fondo negro.
       */}
      <div aria-hidden className="pointer-events-none relative w-full overflow-hidden" style={{ height: 220, marginTop: -110, zIndex: 5 }}>
        {/* Capa negra superior que cubre el borde del hero */}
        
        {/* Pulso de aurora verde — el efecto visible */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "70vw",
            height: 140,
            background: "radial-gradient(ellipse at center, rgb(0 106 78 / 0.28) 0%, rgb(0 60 44 / 0.12) 50%, transparent 75%)",
            filter: "blur(24px)",
          }}
        />
        {/* Capa negra inferior que se funde con el fondo del catálogo */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: "linear-gradient(to bottom, rgb(1 2 1) 0%, transparent 100%)" }}
        />
      </div>

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

