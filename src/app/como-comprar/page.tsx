import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/structured-data";
import { buttonClasses } from "@/components/ui/Button";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";
import { PurchaseGuarantees, PurchaseSteps } from "@/components/home/HowToBuy";

const page = siteConfig.home.purchasePage;
/** Payment and shipping questions (the first ones of the home FAQ). */
const faq = siteConfig.home.faq.slice(0, 6);

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: page.path },
  openGraph: {
    type: "website",
    locale: siteConfig.ogLocale,
    siteName: siteConfig.name,
    url: page.path,
    title: `${page.metaTitle} | ${siteConfig.name}`,
    description: page.metaDescription,
  },
};

/**
 * The full purchase procedure for buyers outside Arequipa, with the deposit
 * amount and deadlines. Built to be sent as a link on WhatsApp
 * (revolt-laptops.com/como-comprar); the home and product pages only describe
 * the steps, without amounts.
 */
export default function PurchasePage() {
  return (
    <main className="relative flex-1">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.metaTitle,
            description: page.metaDescription,
            url: absoluteUrl(page.path),
            inLanguage: siteConfig.locale,
            about: { "@id": `${siteConfig.url}/#tienda` },
          },
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Cómo comprar", path: page.path },
          ]),
          faqJsonLd(faq),
        ]}
      />

      <div className="mx-auto max-w-[75rem] space-y-16 px-4 pb-20 pt-12 md:space-y-20 md:px-8 md:pb-28 md:pt-20">
        <header className="max-w-3xl">
          <p className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
            Envíos a todo el {siteConfig.business.countryName} por {siteConfig.shipping.carrier}
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">{page.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-on-surface-variant">{page.intro}</p>
        </header>

        <section aria-labelledby="pasos" className="glass rounded-[2rem] p-6 md:p-10">
          <h2 id="pasos" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
            Paso a paso
          </h2>
          <PurchaseSteps className="mt-8" />

          <ul className="mt-10 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
            {page.details.map((item) => (
              <li key={item.title} className="flex gap-3 rounded-2xl border border-primary/25 bg-primary/[0.06] p-4">
                <Icon name={item.icon} className="mt-0.5 shrink-0 text-xl text-primary" />
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-on-surface-variant">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="garantias" className="space-y-6">
          <h2 id="garantias" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
            Lo que te garantizamos
          </h2>
          <PurchaseGuarantees />
        </section>

        <section aria-labelledby="dudas" className="space-y-6">
          <h2 id="dudas" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
            Dudas frecuentes
          </h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.question} className="glass group rounded-2xl transition-[border-color] duration-200 open:border-primary/40">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <Icon
                    name="chevron-down"
                    className="shrink-0 text-xl text-primary transition-transform duration-200 ease-out-strong group-open:rotate-180"
                  />
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-on-surface-variant">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="empezar"
          className="glass flex flex-col gap-8 rounded-[2rem] p-7 md:flex-row md:items-center md:justify-between md:p-12"
        >
          <div className="max-w-2xl space-y-3">
            <h2 id="empezar" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
              ¿Listo para elegir tu laptop?
            </h2>
            <p className="text-lg leading-relaxed text-on-surface-variant">
              Escríbenos por WhatsApp al{" "}
              <span className="font-semibold text-on-background">{siteConfig.whatsapp.display}</span> y te ayudamos a elegir.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <WhatsappLink
              href={generalWhatsappUrl()}
              source="como_comprar_pagina"
              className={buttonClasses({ variant: "primary", size: "lg", className: "min-h-14" })}
            >
              <WhatsappIcon className="text-xl" /> Escríbenos por WhatsApp
            </WhatsappLink>
            <Link href="/#laptops" className={buttonClasses({ variant: "outline", size: "lg", className: "min-h-14" })}>
              Ver laptops <Icon name="arrow" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
