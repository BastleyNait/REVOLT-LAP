import Image from "next/image";
import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";

/**
 * "Cómo comprar sin riesgo": the real payment flow (small deposit → packing
 * video + shipping guide → balance → pickup key), the guarantees and, when
 * there are photos in the config, real deliveries. It answers on the page the
 * questions buyers kept asking on WhatsApp ("¿es confiable?", "¿tienen RUC?").
 */
export function HowToBuy() {
  const { howToBuy, steps, guarantees, deliveries } = siteConfig.home;
  const { ruc, accountHolder, googleBusinessUrl } = siteConfig.business;

  return (
    <section id="como-comprar" aria-labelledby="como-comprar-title" className="glass scroll-mt-28 rounded-[2rem] p-6 md:p-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-2">
          <h2 id="como-comprar-title" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
            {howToBuy.title}
          </h2>
          <p className="text-lg leading-relaxed text-on-surface-variant">{howToBuy.subtitle}</p>
        </div>
        <WhatsappLink
          href={generalWhatsappUrl()}
          source="como_comprar"
          className={buttonClasses({ variant: "primary", size: "md", className: "min-h-12 self-start md:self-auto" })}
        >
          <WhatsappIcon className="text-lg" /> Escríbenos
        </WhatsappLink>
      </div>

      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
        {steps.map((step, index) => (
          <li key={step.title} className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
            <span className="flex items-center gap-2.5">
              <span className="font-display text-sm font-bold tabular-nums text-primary">0{index + 1}</span>
              <Icon name={step.icon} className="text-xl text-primary" />
            </span>
            <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-on-surface-variant">{step.body}</p>
          </li>
        ))}
      </ol>

      <ul className="mt-10 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {guarantees.map((item) => (
          <li key={item.title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <Icon name={item.icon} className="mt-0.5 shrink-0 text-xl text-primary" />
            <div>
              <p className="font-bold">{item.title}</p>
              <p className="mt-1 text-[0.9375rem] leading-relaxed text-on-surface-variant">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>

      {ruc || accountHolder ? (
        <p className="mt-6 flex gap-2.5 text-[0.9375rem] leading-relaxed text-on-surface-variant">
          <Icon name="verified" className="mt-0.5 shrink-0 text-lg text-primary" />
          <span>
            {ruc ? (
              <>
                RUC <strong className="font-semibold text-on-surface">{ruc}</strong>.{" "}
              </>
            ) : null}
            {accountHolder ? (
              <>
                Solo pagas a cuentas a nombre de <strong className="font-semibold text-on-surface">{accountHolder}</strong>, y los números
                te los pasamos únicamente por nuestro WhatsApp oficial{" "}
                <strong className="font-semibold text-on-surface">{siteConfig.whatsapp.display}</strong>. Nunca te pediremos depositar a
                otra persona.
              </>
            ) : null}
          </span>
        </p>
      ) : null}

      {googleBusinessUrl ? (
        <a
          href={googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses({ variant: "outline", size: "md", className: "mt-6 min-h-12" })}
        >
          <Icon name="verified" className="text-lg text-primary" /> Ver reseñas en Google
        </a>
      ) : null}

      {deliveries.length ? (
        <div className="mt-10 border-t border-white/10 pt-8">
          <h3 className="text-xl font-bold">Entregas reales</h3>
          <p className="mt-1 text-on-surface-variant">Algunas de las laptops que ya entregamos.</p>
          <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {deliveries.map((photo) => (
              <li key={photo.src} className="relative aspect-square overflow-hidden rounded-2xl bg-black/40">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 16rem, 45vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
