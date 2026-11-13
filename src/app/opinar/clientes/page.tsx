import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { Icon } from "@/components/ui/Icon";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export const metadata: Metadata = {
  title: "Deja tu opinión",
  robots: { index: false, follow: false },
};

/**
 * /opinar/clientes: enlace general para clientes que compraron antes de las
 * cartas con QR. Un solo enlace para compartir con todos; cada opinión entra
 * oculta y se publica al aprobarla en /admin/opiniones.
 */
export default function OpenReviewPage() {
  return (
    <main className="relative flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-10 md:pt-16">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Icon name="verified" className="text-lg" /> Clientes {siteConfig.name}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight md:text-5xl">¿Qué te pareció tu laptop?</h1>
        <p className="mt-3 text-lg text-on-surface-variant">Gracias por confiar en nosotros. Tu opinión ayuda a otros a comprar con confianza.</p>
        <div className="glass mt-8 rounded-[2rem] p-6 md:p-8">
          <ReviewForm mode="open" defaultAuthor="" googleUrl={siteConfig.business.googleBusinessUrl} />
        </div>
      </div>
    </main>
  );
}
