import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { DELIVERED_TOTAL, isLocalDelivery, realShipments, shippedCities, SHIPPING_ORIGIN, TRANSPORT_LABEL, type RealShipment } from "@/lib/config/shipments";
import { getPublicReviews, type PublicReview } from "@/lib/repositories/reviews";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";
import { buttonClasses } from "@/components/ui/Button";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { ShipmentsMap } from "@/components/shipments/ShipmentsMap";
import { Stars } from "@/components/reviews/Stars";
import { ReviewCards, ReviewsSummary } from "@/components/reviews/ReviewsSection";

// Regenerated on demand when something changes (admin saves, new reviews: see
// revalidatePath calls); this is only a daily safety net. A 60 s window made
// every visited page rewrite its cache every minute (Vercel "ISR Writes").
export const revalidate = 86400;

const PATH = "/nuestros-envios";

export const metadata: Metadata = {
  title: "Envíos reales de laptops a todo el Perú",
  description:
    "Fotos reales de nuestros envíos desde Arequipa a otras ciudades del Perú y de nuestras entregas en Arequipa, con la opinión de quien recibió su laptop. Embalaje seguro y envío por Shalom.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: siteConfig.ogLocale,
    siteName: siteConfig.name,
    url: PATH,
    title: `Envíos reales de laptops a todo el Perú | ${siteConfig.name}`,
  },
};

const monthYear = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));

/** The customer's published review, only when exactly one matches name + city. */
function reviewFor(shipment: RealShipment, reviews: PublicReview[]): PublicReview | null {
  const first = shipment.customer.split(/\s+/)[0].toLowerCase();
  const matches = reviews.filter(
    (r) => r.city.trim().toLowerCase() === shipment.city.toLowerCase() && r.author.split(/\s+/)[0].toLowerCase() === first,
  );
  return matches.length === 1 ? matches[0] : null;
}

export default async function RealShipmentsPage() {
  const reviews = await getPublicReviews(50);
  const shipments = [...realShipments].sort((a, b) => b.date.localeCompare(a.date));
  const cities = shippedCities.length;

  return (
    <main className="relative flex-1">
      <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Nuestros envíos", path: PATH }])} />

      <div className="mx-auto max-w-[75rem] wide:max-w-[min(92vw,120rem)] space-y-20 px-4 pb-20 pt-8 md:space-y-24 md:px-8 md:pb-28 md:pt-12">
        {/* Header + map */}
        <section className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 -z-10 h-[28rem] w-[min(48rem,100vw)] bg-[radial-gradient(ellipse_at_30%_40%,rgb(0_106_78/0.32)_0%,rgb(0_60_44/0.12)_45%,transparent_72%)]"
          />
          <div>
            <nav aria-label="Ruta de navegación" className="text-sm text-on-surface-variant">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href="/" className="transition-colors hover:text-on-background">Inicio</Link></li>
                <li aria-hidden><Icon name="chevron-right" className="text-base" /></li>
                <li aria-current="page" className="font-semibold text-on-background">Nuestros envíos</li>
              </ol>
            </nav>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.18em] text-primary">
              <Icon name="truck" className="text-base" /> Envíos reales
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Laptops que ya llegaron <span className="text-primary">a sus dueños</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Algunos de nuestros envíos y entregas, con fotos reales —y los datos personales ocultos— y la opinión de quien recibió
              su laptop. Así trabajamos con cada cliente, en {SHIPPING_ORIGIN.city} o en cualquier ciudad del Perú.
            </p>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
              <div>
                <dt className="text-sm font-semibold text-on-surface-variant">Laptops entregadas</dt>
                <dd className="font-display text-4xl font-extrabold text-primary">{DELIVERED_TOTAL}+</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-on-surface-variant">Ciudades</dt>
                <dd className="font-display text-4xl font-extrabold text-primary">{cities}</dd>
              </div>
              {reviews.count ? (
                <div>
                  <dt className="text-sm font-semibold text-on-surface-variant">Opiniones</dt>
                  <dd className="flex items-center gap-2 font-display text-4xl font-extrabold text-primary">
                    {reviews.average.toFixed(1)} <Stars value={reviews.average} size="sm" />
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/#laptops" className={buttonClasses({ variant: "primary", size: "lg", className: "min-h-14" })}>
                Ver laptops <Icon name="arrow" />
              </Link>
              <WhatsappLink
                href={generalWhatsappUrl("Hola REVOLT, estoy fuera de Arequipa y quiero una laptop. ¿Cómo sería el envío?")}
                source="nuestros_envios_hero"
                className="inline-flex min-h-14 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 text-sm font-bold text-white transition-[background-color,border-color] duration-150 hover:border-white/30 hover:bg-white/10"
              >
                <WhatsappIcon className="text-lg" /> Cotizar envío a mi ciudad
              </WhatsappLink>
            </div>
          </div>

          <ShipmentsMap shipments={realShipments} className="mx-auto w-full max-w-[30rem]" />
        </section>

        {/* One story per shipment */}
        <section aria-labelledby="envios-title" className="space-y-8">
          <h2 id="envios-title" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
            Algunos de nuestros envíos
          </h2>
          <p className="-mt-4 max-w-2xl text-lg text-on-surface-variant">Una muestra de las laptops que ya entregamos, paso a paso.</p>
          <ul className="space-y-8">
            {shipments.map((s) => {
              const review = reviewFor(s, reviews.items);
              const local = isLocalDelivery(s);
              const [cover, ...rest] = s.photos;
              return (
                <li key={s.id} className="glass overflow-hidden rounded-[2rem]">
                  <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* photos */}
                    <div className="grid grid-cols-6 gap-1.5 bg-black/30 p-1.5">
                      {cover ? (
                        <a
                          href={cover.src}
                          target="_blank"
                          rel="noreferrer"
                          className={`relative col-span-6 block overflow-hidden rounded-[1.4rem] ${rest.length ? "aspect-[16/10]" : "aspect-[4/3] lg:aspect-auto lg:min-h-[26rem]"}`}
                        >
                          <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 1024px) 40rem, 100vw" className="object-cover" style={cover.focus ? { objectPosition: cover.focus } : undefined} />
                        </a>
                      ) : null}
                      {rest.map((p) => (
                        <a
                          key={p.src}
                          href={p.src}
                          target="_blank"
                          rel="noreferrer"
                          className={`relative block aspect-[4/3] overflow-hidden rounded-[1.1rem] ${rest.length === 3 ? "col-span-2" : "col-span-3"} ${p.contain ? "bg-white" : ""}`}
                        >
                          <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 14rem, 33vw" className={p.contain ? "object-contain" : "object-cover"} style={p.focus ? { objectPosition: p.focus } : undefined} />
                        </a>
                      ))}
                    </div>

                    {/* story */}
                    <div className="flex flex-col p-6 md:p-9">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-on-surface-variant">{monthYear(s.date)}</p>
                      <h3 className="mt-2 text-3xl font-extrabold md:text-4xl">
                        {local ? (
                          <>Entrega en <span className="text-primary">{s.city}</span></>
                        ) : (
                          <>{SHIPPING_ORIGIN.city} <span className="text-primary">→ {s.city}</span></>
                        )}
                      </h3>
                      <p className="mt-1 text-on-surface-variant">{s.region} · Para {s.customer}</p>

                      <ul className="mt-5 flex flex-wrap gap-2">
                        {s.transport ? (
                          <li className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                            {TRANSPORT_LABEL[s.transport]}
                          </li>
                        ) : null}
                        {s.freeShipping ? (
                          <li className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Envío gratis</li>
                        ) : null}
                        {local ? null : (
                          <li className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm font-semibold">Recojo en agencia Shalom</li>
                        )}
                        <li className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm font-semibold">Datos personales ocultos</li>
                      </ul>

                      {review ? (
                        <figure className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                          <Stars value={review.rating} size="sm" />
                          {review.comment ? (
                            <blockquote className="mt-3 text-lg leading-relaxed">“{review.comment}”</blockquote>
                          ) : null}
                          <figcaption className="mt-3 flex flex-wrap items-center gap-x-1.5 text-sm text-on-surface-variant">
                            <span className="font-semibold text-on-background">{review.author}</span>
                            <BadgeCheck className="ml-1 h-4 w-4 text-primary" aria-hidden />
                            <span className="font-semibold text-primary">Compra verificada</span>
                          </figcaption>
                        </figure>
                      ) : (
                        <p className="mt-7 text-on-surface-variant">
                          {local
                            ? "Se la llevamos embalada y con guía a su nombre hasta su domicilio."
                            : `Su laptop salió de ${SHIPPING_ORIGIN.city} embalada y con guía de envío a su nombre.`}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {reviews.count ? (
          <section aria-labelledby="opiniones-envios" className="space-y-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 id="opiniones-envios" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
                Lo que dicen al recibirla
              </h2>
              <ReviewsSummary summary={reviews} />
            </div>
            <ReviewCards summary={reviews} limit={6} />
            <Link
              href="/opiniones"
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
            >
              Ver todas las opiniones <Icon name="arrow" />
            </Link>
          </section>
        ) : null}

        <section className="glass flex flex-col gap-6 rounded-[2rem] p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-extrabold md:text-3xl">¿Vives fuera de {SHIPPING_ORIGIN.city}? Te la enviamos igual</h2>
            <p className="text-lg text-on-surface-variant">
              Te mostramos tu laptop embalada y la guía de envío antes de que pagues el saldo.{" "}
              <Link href={siteConfig.home.purchasePage.path} className="font-semibold text-primary underline underline-offset-4">
                Así funciona
              </Link>
            </p>
          </div>
          <WhatsappLink
            href={generalWhatsappUrl("Hola REVOLT, estoy fuera de Arequipa y quiero una laptop. ¿Cómo sería el envío?")}
            source="nuestros_envios_cta"
            className={buttonClasses({ variant: "primary", size: "lg", className: "min-h-14 shrink-0" })}
          >
            <WhatsappIcon className="text-xl" /> Escríbenos
          </WhatsappLink>
        </section>
      </div>
    </main>
  );
}
