import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/repositories/products";
import { landingBySlug, landingPath, landings } from "@/lib/seo/landings";
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/config/site";
import { formatPrice } from "@/lib/utils/format";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";

export const revalidate = 60;
export const dynamicParams = false;

type PageParams = { params: Promise<{ landing: string }> };

export function generateStaticParams() {
  return landings.map((landing) => ({ landing: landing.slug }));
}

async function load(slug: string) {
  const landing = landingBySlug(slug);
  if (!landing) return null;
  const all = await getProducts();
  const matches = landing.select(all);
  const minPrice = all.length ? Math.min(...all.map((p) => p.price)) : null;
  return { landing, all, matches, minPrice };
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { landing: slug } = await params;
  const data = await load(slug);
  if (!data) return {};
  const { landing, minPrice } = data;
  const title = landing.title.replace(
    " | Desde {min}",
    minPrice ? ` | Desde ${formatPrice(minPrice)}` : "",
  ).replace("{min}", minPrice ? formatPrice(minPrice) : "");

  return {
    title: { absolute: title },
    description: landing.description,
    keywords: landing.keywords,
    alternates: { canonical: landingPath(landing.slug) },
    openGraph: {
      type: "website",
      locale: siteConfig.ogLocale,
      siteName: siteConfig.name,
      url: landingPath(landing.slug),
      title,
      description: landing.description,
    },
  };
}

export default async function LandingPage({ params }: PageParams) {
  const { landing: slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  const { landing, all, matches } = data;
  const products = matches.length ? matches : [...all].sort((a, b) => a.price - b.price);
  const related = landing.related.map(landingBySlug).filter((item) => item !== undefined);

  return (
    <main className="relative flex-1">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Laptops", path: "/laptops" },
            { name: landing.h1, path: landingPath(landing.slug) },
          ]),
          itemListJsonLd(products),
          faqJsonLd(landing.faq),
        ]}
      />

      <div className="mx-auto max-w-[75rem] space-y-16 px-4 pb-20 pt-8 md:space-y-20 md:px-8 md:pb-28 md:pt-12">
        <header className="space-y-5">
          <nav aria-label="Ruta de navegación" className="text-sm text-on-surface-variant">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="transition-colors hover:text-on-background">Inicio</Link></li>
              <li aria-hidden><Icon name="chevron-right" className="text-base" /></li>
              <li><Link href="/laptops" className="transition-colors hover:text-on-background">Laptops</Link></li>
              <li aria-hidden><Icon name="chevron-right" className="text-base" /></li>
              <li aria-current="page" className="font-semibold text-on-background">{landing.h1}</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-extrabold leading-[1.05] md:text-6xl">{landing.h1}</h1>
          <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-on-surface-variant">
            {landing.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </header>

        <section aria-labelledby="disponibles" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="disponibles" className="text-2xl font-extrabold md:text-3xl">
              {matches.length ? `${landing.h1} disponibles` : "Laptops disponibles"}
            </h2>
            <p className="text-sm font-semibold text-on-surface-variant">
              {products.length} {products.length === 1 ? "equipo" : "equipos"} · ordenados por precio
            </p>
          </div>
          {!matches.length && landing.emptyNote ? <p className="text-on-surface-variant">{landing.emptyNote}</p> : null}
          <ProductGrid products={products} />
        </section>

        <section aria-labelledby="consejos" className="space-y-6">
          <h2 id="consejos" className="text-2xl font-extrabold md:text-3xl">Qué tener en cuenta</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {landing.tips.map((tip) => (
              <li key={tip.title} className="glass rounded-3xl p-6">
                <h3 className="text-lg font-bold">{tip.title}</h3>
                <p className="mt-2 leading-relaxed text-on-surface-variant">{tip.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="faq-landing" className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 id="faq-landing" className="text-2xl font-extrabold md:text-3xl">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {landing.faq.map((item) => (
              <details key={item.question} className="glass group rounded-2xl open:border-primary/40">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <Icon name="chevron-down" className="text-xl text-primary transition-transform duration-200 ease-out-strong group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-on-surface-variant">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="relacionadas" className="space-y-5">
          <h2 id="relacionadas" className="text-2xl font-extrabold md:text-3xl">También te puede interesar</h2>
          <ul className="flex flex-wrap gap-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={landingPath(item.slug)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 font-semibold transition-colors duration-150 hover:border-primary/50 hover:text-primary"
                >
                  {item.label} <Icon name="arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass flex flex-col gap-6 rounded-[2rem] p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold md:text-3xl">¿No encuentras lo que buscas?</h2>
            <p className="text-lg text-on-surface-variant">Cuéntanos qué necesitas y te avisamos cuando llegue una laptop así.</p>
          </div>
          <WhatsappLink
            href={generalWhatsappUrl(`Hola REVOLT, estoy buscando ${landing.h1.toLowerCase()}.`)}
            source={`landing_${landing.slug}`}
            className={buttonClasses({ variant: "primary", size: "lg", className: "min-h-14 shrink-0" })}
          >
            <WhatsappIcon className="text-xl" /> Escríbenos
          </WhatsappLink>
        </section>
      </div>
    </main>
  );
}
