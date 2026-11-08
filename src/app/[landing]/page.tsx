import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/repositories/products";
import { landingBySlug, landingPath, landings } from "@/lib/seo/landings";
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/config/site";
import { formatPrice } from "@/lib/utils/format";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { Catalog } from "@/components/product/Catalog";
import { TrustBar } from "@/components/home/TrustBar";
import { HowToBuy } from "@/components/home/HowToBuy";
import { Faq } from "@/components/home/Faq";
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
  // The landing's own questions first, then the store's trust questions (safe
  // purchase, warranty, receipt, shipping), without repeats.
  const seen = new Set(landing.faq.map((item) => item.question));
  const faq = [...landing.faq, ...siteConfig.home.faq.slice(0, 6).filter((item) => !seen.has(item.question))];

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
          faqJsonLd(faq),
        ]}
      />

      <div className="mx-auto max-w-[75rem] space-y-20 px-4 pb-20 pt-8 md:space-y-28 md:px-8 md:pb-28 md:pt-12">
        <header className="relative">
          {/* Soft green glow behind the title, echoing the home hero. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 -z-10 h-[28rem] w-[min(48rem,100vw)] bg-[radial-gradient(ellipse_at_30%_40%,rgb(0_106_78/0.32)_0%,rgb(0_60_44/0.12)_45%,transparent_72%)]"
          />
          <nav aria-label="Ruta de navegación" className="text-sm text-on-surface-variant">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="transition-colors hover:text-on-background">Inicio</Link></li>
              <li aria-hidden><Icon name="chevron-right" className="text-base" /></li>
              <li><Link href="/laptops" className="transition-colors hover:text-on-background">Laptops</Link></li>
              <li aria-hidden><Icon name="chevron-right" className="text-base" /></li>
              <li aria-current="page" className="font-semibold text-on-background">{landing.h1}</li>
            </ol>
          </nav>

          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">{landing.h1}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
            {landing.lead ?? landing.intro[0]}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="#laptops" className={buttonClasses({ variant: "primary", size: "lg", className: "min-h-14" })}>
              Ver laptops <Icon name="arrow" />
            </Link>
            <WhatsappLink
              href={generalWhatsappUrl(`Hola REVOLT, estoy buscando ${landing.h1.toLowerCase()}.`)}
              source={`landing_${landing.slug}_hero`}
              className="fx-panel inline-flex min-h-14 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur-md transition-[transform,background-color,border-color] duration-150 ease-out-strong hover:border-white/30 hover:bg-white/10 active:scale-[0.97]"
            >
              <WhatsappIcon className="text-lg" /> WhatsApp
            </WhatsappLink>
            <Link
              href={siteConfig.home.purchasePage.path}
              className="inline-flex min-h-11 items-center gap-2 px-2 text-[0.9375rem] font-semibold text-white underline decoration-primary/60 underline-offset-4 transition-colors duration-150 hover:text-primary"
            >
              <Icon name="shield" className="text-lg text-primary" /> {siteConfig.home.hero.safeLink}
            </Link>
          </div>

          <TrustBar className="mt-8 w-fit max-w-full" />
        </header>

        <Catalog
          products={products}
          className="!mt-12 md:!mt-16"
          title={`${landing.label} disponibles`}
          subtitle={!matches.length && landing.emptyNote ? landing.emptyNote : siteConfig.home.inventory.subtitle}
        />

        <section aria-labelledby="sobre" className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="space-y-5">
            <h2 id="sobre" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
              Lo que debes saber sobre las {landing.label.charAt(0).toLowerCase() + landing.label.slice(1)}
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-on-surface-variant">
              {landing.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ul className="glass divide-y divide-white/10 rounded-[2rem] px-6 md:px-8">
            {landing.tips.map((tip, index) => (
              <li key={tip.title} className="flex gap-5 py-6">
                <span className="font-display text-sm font-bold tabular-nums text-primary">0{index + 1}</span>
                <div>
                  <h3 className="text-lg font-bold">{tip.title}</h3>
                  <p className="mt-1 leading-relaxed text-on-surface-variant">{tip.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <HowToBuy />

        <Faq items={faq} />

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
