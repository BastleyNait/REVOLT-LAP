import type { Metadata } from "next";
import Link from "next/link";
import { getInvite, displayName } from "@/lib/repositories/reviews";
import { siteConfig } from "@/lib/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Stars } from "@/components/reviews/Stars";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tu opinión",
  robots: { index: false, follow: false },
};

type PageParams = { params: Promise<{ token: string }> };

/**
 * /opinar/<token>: the buyer's one-time review form, reached from the QR of
 * the thank-you letter. Only a valid, unused token shows the form.
 */
export default async function ReviewPage({ params }: PageParams) {
  const { token } = await params;
  const invite = await getInvite(token);
  const first = invite?.customer_name.trim().split(/\s+/)[0] ?? "";

  return (
    <main className="relative flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-10 md:pt-16">
        {!invite ? (
          <Message icon="warning" title="Este enlace no es válido">
            Revisa que hayas abierto el enlace o escaneado el código que te enviamos. Si el problema sigue, escríbenos por WhatsApp al {siteConfig.whatsapp.display}.
          </Message>
        ) : invite.submitted_at ? (
          <Message icon="check" title={`¡Gracias, ${first}! Ya recibimos tu opinión`} googleUrl={siteConfig.business.googleBusinessUrl}>
            <span className="mt-4 flex justify-center">
              <Stars value={invite.rating ?? 5} size="lg" />
            </span>
            {invite.comment ? <span className="mt-4 block italic">“{invite.comment}”</span> : null}
          </Message>
        ) : (
          <>
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Icon name="verified" className="text-lg" /> Compra verificada · Pedido {invite.order_code}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight md:text-5xl">
              Hola {first}, ¿qué te pareció tu laptop?
            </h1>
            {invite.laptop ? <p className="mt-3 text-lg text-on-surface-variant">{invite.laptop}</p> : null}
            <div className="glass mt-8 rounded-[2rem] p-6 md:p-8">
              <ReviewForm token={token} defaultAuthor={displayName(invite.customer_name)} googleUrl={siteConfig.business.googleBusinessUrl} />
            </div>
            <p className="mt-5 text-center text-sm text-on-surface-variant">
              Tu opinión se publica en {siteConfig.name} como compra verificada. Este enlace es solo tuyo y se usa una vez.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function Message({ icon, title, googleUrl, children }: { icon: string; title: string; googleUrl?: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-[2rem] p-8 text-center md:p-12">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
        <Icon name={icon} className="text-3xl" />
      </span>
      <h1 className="mt-5 text-3xl font-extrabold leading-tight">{title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-on-surface-variant">{children}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {googleUrl ? (
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "primary", size: "md", className: "min-h-12" })}>
            También dejarla en Google
          </a>
        ) : null}
        <Link href="/opiniones" className={buttonClasses({ variant: "primary", size: "md", className: "min-h-12" })}>
          Ver opiniones
        </Link>
        <Link href="/" className={buttonClasses({ variant: "outline", size: "md", className: "min-h-12" })}>
          Ir a la tienda
        </Link>
      </div>
    </div>
  );
}
