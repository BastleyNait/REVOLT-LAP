import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/repositories/products";
import { landingPath, landings } from "@/lib/seo/landings";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/config/site";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";

export const revalidate = 60;

const title = "Laptops en Perú: Baratas, Reacondicionadas y Seminuevas | REVOLT";
const description =
  "Catálogo de laptops en Perú: baratas, económicas, reacondicionadas y seminuevas. Lenovo ThinkPad, Dell y HP con todo funcional y envíos a todo el Perú.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/laptops" },
  openGraph: { type: "website", locale: siteConfig.ogLocale, siteName: siteConfig.name, url: "/laptops", title, description },
};

export default async function LaptopsPage() {
  const products = [...(await getProducts())].sort((a, b) => a.price - b.price);

  return (
    <main className="relative flex-1">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Laptops", path: "/laptops" },
          ]),
          itemListJsonLd(products),
        ]}
      />
      <div className="mx-auto max-w-[75rem] space-y-14 px-4 pb-20 pt-8 md:px-8 md:pb-28 md:pt-12">
        <header className="space-y-5">
          <h1 className="text-4xl font-extrabold leading-[1.05] md:text-6xl">Laptops en Perú</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-on-surface-variant">
            Todas nuestras laptops baratas, económicas, reacondicionadas y seminuevas en un solo lugar: Lenovo ThinkPad, Dell
            Latitude y HP EliteBook revisadas por técnicos, con todo funcional y envíos a todo el Perú (y entrega en persona en Arequipa).
          </p>
          <nav aria-label="Categorías de laptops">
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
        </header>

        <section aria-labelledby="todas" className="space-y-6">
          <h2 id="todas" className="text-2xl font-extrabold md:text-3xl">
            Todas las laptops disponibles <span className="text-on-surface-variant">({products.length})</span>
          </h2>
          <ProductGrid products={products} />
        </section>
      </div>
    </main>
  );
}
