import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buttonClasses } from "@/components/ui/Button";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";

const { about, promise, business } = siteConfig;

export const metadata: Metadata = {
  title: about.metaTitle,
  description: about.metaDescription,
  alternates: { canonical: "/nosotros" },
  openGraph: {
    type: "website",
    locale: siteConfig.ogLocale,
    siteName: siteConfig.name,
    url: "/nosotros",
    title: `${about.metaTitle} | ${siteConfig.name}`,
    description: about.metaDescription,
  },
};

const conditionGuide = [
  {
    label: "Excelente estado",
    body: "Marcas de uso mínimas o nulas. Por fuera se ve prácticamente como nueva.",
  },
  {
    label: "Buen estado",
    body: "Puede tener marcas leves en la carcasa o la tapa que no afectan en nada el funcionamiento.",
  },
  {
    label: "Detalle indicado",
    body: "Si algún componente no está al 100 % (por ejemplo, la batería), lo verás escrito en la descripción antes de comprar.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative flex-1">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: about.metaTitle,
            description: about.metaDescription,
            url: absoluteUrl("/nosotros"),
            inLanguage: siteConfig.locale,
            about: { "@id": `${siteConfig.url}/#tienda` },
          },
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: about.title, path: "/nosotros" },
          ]),
        ]}
      />

      <div className="mx-auto max-w-[75rem] space-y-24 px-4 pb-20 pt-12 md:space-y-28 md:px-8 md:pb-28 md:pt-20">
        <header className="max-w-3xl">
          <p className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
            {about.title} · Tienda online en {business.city}
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Laptops reacondicionadas <span className="text-primary">profesionalmente</span>
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-on-surface-variant">{about.intro}</p>
        </header>

        <section aria-labelledby="promesa" className="glass rounded-[2rem] p-7 md:p-12">
          <div className="max-w-3xl space-y-5">
            <h2 id="promesa" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
              Todo funcional, <span className="text-primary">salvo que se indique lo contrario</span>
            </h2>
            <blockquote className="border-l-2 border-primary pl-5 text-lg font-medium leading-relaxed text-on-surface">
              {promise.body}
            </blockquote>
            <p className="leading-relaxed text-on-surface-variant">
              Es nuestra regla de oro: <strong className="text-on-background">si no se dice lo contrario en la ficha, todo funciona</strong>:
              pantalla, teclado, touchpad, batería, puertos, cámara, audio, Wi-Fi y Bluetooth. Y si un detalle no está perfecto, lo
              escribimos en la descripción y te lo mostramos en fotos antes de que compres.
            </p>
          </div>
        </section>

        <section aria-labelledby="proceso" className="space-y-8">
          <SectionHeading id="proceso" title="Qué hacemos con cada laptop" subtitle="Ningún equipo se publica sin pasar por estas cuatro etapas." />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.process.map((step, index) => (
              <li key={step.title} className="glass rounded-3xl p-6">
                <span className="font-display text-sm font-bold tabular-nums text-primary">0{index + 1}</span>
                <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-on-surface-variant">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="estado" className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5">
            <h2 id="estado" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
              ¿Qué significa «reacondicionada»?
            </h2>
            <p className="text-lg leading-relaxed text-on-surface-variant">
              Es un equipo de segunda mano —casi siempre de uso corporativo— que fue revisado, limpiado y probado por técnicos. No es lo
              mismo que una laptop «usada» sin revisar: pasa por un proceso que asegura que funcione como debe.
            </p>
            <p className="text-lg leading-relaxed text-on-surface-variant">
              El estado que ves en cada ficha describe su <strong className="text-on-background">aspecto físico</strong>, no su
              funcionamiento: todas funcionan correctamente.
            </p>
          </div>
          <ul className="glass divide-y divide-white/10 rounded-[2rem] px-6 md:px-8">
            {conditionGuide.map((item) => (
              <li key={item.label} className="py-5">
                <p className="flex items-center gap-2 font-bold">
                  <Icon name="check-plain" className="text-primary" strokeWidth={3} /> {item.label}
                </p>
                <p className="mt-1.5 leading-relaxed text-on-surface-variant">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="por-que" className="space-y-8">
          <SectionHeading id="por-que" title="Por qué comprar reacondicionado" />
          <ul className="grid gap-4 sm:grid-cols-2">
            {about.reasons.map((reason) => (
              <li key={reason.title} className="glass rounded-3xl p-6 md:p-7">
                <h3 className="text-xl font-bold">{reason.title}</h3>
                <p className="mt-2 leading-relaxed text-on-surface-variant">{reason.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="contacto"
          className="glass flex flex-col gap-8 rounded-[2rem] p-7 md:flex-row md:items-center md:justify-between md:p-12"
        >
          <div className="max-w-2xl space-y-3">
            <h2 id="contacto" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
              100 % online, con envíos a todo el {business.countryName}
            </h2>
            <p className="text-lg leading-relaxed text-on-surface-variant">
              Escríbenos para pedir más fotos o un video del equipo, resolver dudas o coordinar tu envío. Te atendemos por WhatsApp al{" "}
              <span className="font-semibold text-on-background">{siteConfig.whatsapp.display}</span>.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <WhatsappLink
              href={generalWhatsappUrl()}
              source="nosotros"
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
