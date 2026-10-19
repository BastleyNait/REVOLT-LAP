import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/repositories/products";
import { Hero } from "@/components/home/Hero";
import { HowToBuy } from "@/components/home/HowToBuy";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/config/site";
import { landingPath, landings } from "@/lib/seo/landings";
import { Icon } from "@/components/ui/Icon";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const products = await getProducts();
  const minPrice = products.length ? Math.min(...products.map((product) => product.price)) : null;
  const { inventory } = siteConfig.home;

  return (
    <main className="relative flex-1">
      <JsonLd data={[itemListJsonLd(products), faqJsonLd(siteConfig.home.faq)]} />
      <Hero minPrice={minPrice} />

      {/*
       * Hero → catálogo: la sección arranca en el mismo negro del hero y se
       * disuelve hacia la aurora, con el pulso verde original sobre la unión.
       */}
      <div aria-hidden className="pointer-events-none relative z-[2] h-0">
        <div className="absolute inset-x-0 top-0 h-[26rem] bg-[linear-gradient(to_bottom,rgb(1_2_1)_0%,rgb(1_2_1/0.85)_30%,rgb(1_2_1/0.4)_65%,transparent_100%)]" />
        <div className="absolute left-1/2 top-0 h-36 w-[70vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgb(0_106_78/0.28)_0%,rgb(0_60_44/0.12)_50%,transparent_75%)] blur-2xl" />
      </div>

      <div className="relative z-[3] mx-auto max-w-[75rem] space-y-24 px-4 pb-20 pt-6 md:space-y-32 md:px-8 md:pb-28">
        <section id="laptops" aria-labelledby="laptops-title" className="space-y-8">
          <SectionHeading
            id="laptops-title"
            title={inventory.title}
            subtitle={inventory.subtitle}
            aside={
              products.length ? (
                <p className="text-sm font-semibold text-on-surface-variant">
                  {products.length} {products.length === 1 ? "equipo" : "equipos"} en stock
                </p>
              ) : null
            }
          />
          <ProductGrid products={products} />
          <nav aria-labelledby="busca-por-tipo" className="space-y-3 pt-2">
            <h3 id="busca-por-tipo" className="text-sm font-semibold text-on-surface-variant">Busca por tipo</h3>
            <ul className="flex flex-wrap gap-2.5">
              {landings.map((landing) => (
                <li key={landing.slug}>
                  <Link
                    href={landingPath(landing.slug)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-[0.9375rem] font-semibold transition-colors duration-150 hover:border-primary/50 hover:text-primary"
                  >
                    {landing.label} <Icon name="chevron-right" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <HowToBuy />
        <AboutTeaser />
        <Faq />
        <FinalCta />
      </div>
    </main>
  );
}
