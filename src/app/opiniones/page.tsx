import type { Metadata } from "next";
import Link from "next/link";
import { getPublicReviews } from "@/lib/repositories/reviews";
import { siteConfig } from "@/lib/config/site";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ReviewCards, ReviewsSummary } from "@/components/reviews/ReviewsSection";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Opiniones de clientes",
  description: `Opiniones verificadas de clientes de ${siteConfig.name}: solo pueden opinar quienes compraron una laptop, con un código único en su caja.`,
  alternates: { canonical: "/opiniones" },
};

export default async function ReviewsPage() {
  const summary = await getPublicReviews(200);

  return (
    <main className="relative flex-1">
      <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Opiniones", path: "/opiniones" }])} />
      <div className="mx-auto max-w-[75rem] space-y-12 px-4 pb-20 pt-12 md:px-8 md:pb-28 md:pt-20">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Icon name="verified" className="text-lg" /> Opiniones verificadas
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">Lo que dicen nuestros clientes</h1>
            <p className="mt-5 text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Cada cliente recibe en su caja un código QR único que solo sirve una vez. Así, todas las opiniones de esta página son de
              personas que compraron de verdad.
            </p>
          </div>
          {summary.count ? <ReviewsSummary summary={summary} /> : null}
        </header>

        {summary.count ? (
          <ReviewCards summary={summary} />
        ) : (
          <div className="glass rounded-[2rem] p-10 text-center">
            <p className="text-lg text-on-surface-variant">Muy pronto verás aquí las opiniones de nuestros clientes.</p>
            <Link href="/#laptops" className={buttonClasses({ variant: "primary", size: "md", className: "mt-6 min-h-12" })}>
              Ver laptops <Icon name="arrow" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
