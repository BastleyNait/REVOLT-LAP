import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { ComplaintForm } from "@/components/complaints/ComplaintForm";
import { BookIcon } from "@/components/complaints/BookIcon";

export const metadata: Metadata = {
  title: "Libro de Reclamaciones",
  description: `Libro de Reclamaciones virtual de ${siteConfig.legalName}. Registra tu reclamo o queja y recibe respuesta en un plazo no mayor a 15 días hábiles.`,
  alternates: { canonical: "/libro-de-reclamaciones" },
};

const today = () =>
  new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Lima" }).format(new Date());

/** Virtual Libro de Reclamaciones (Código de Protección y Defensa del Consumidor). */
export default function ComplaintsBookPage() {
  const { business, legalName } = siteConfig;

  return (
    <main className="relative flex-1">
      <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Libro de Reclamaciones", path: "/libro-de-reclamaciones" }])} />
      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-20 pt-10 md:pt-16">
        <header className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
            <BookIcon className="h-8 w-8" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">Libro de Reclamaciones</h1>
            <p className="mt-2 text-on-surface-variant">Hoja de reclamación virtual · {today()}</p>
          </div>
        </header>

        <section className="glass rounded-[1.75rem] p-5 text-sm leading-relaxed md:p-7">
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
            <dt className="font-semibold text-on-surface-variant">Proveedor</dt>
            <dd>
              {legalName}
              {business.accountHolder ? ` · ${business.accountHolder}` : ""}
            </dd>
            {business.ruc ? (
              <>
                <dt className="font-semibold text-on-surface-variant">RUC</dt>
                <dd>{business.ruc}</dd>
              </>
            ) : null}
            <dt className="font-semibold text-on-surface-variant">Domicilio</dt>
            <dd>{business.fiscalAddress || `${business.city}, ${business.countryName}`}</dd>
          </dl>
        </section>

        <ComplaintForm />

        <div className="space-y-2 text-xs leading-relaxed text-on-surface-variant">
          <p>
            * La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para
            interponer una denuncia ante el INDECOPI.
          </p>
          <p>* El proveedor deberá dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles.</p>
        </div>
      </div>
    </main>
  );
}
