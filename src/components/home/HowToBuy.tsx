import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsappIcon } from "@/components/ui/Icon";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";

/** Three-step purchase flow in a single glass panel. */
export function HowToBuy() {
  return (
    <section id="como-comprar" aria-labelledby="como-comprar-title" className="glass rounded-[2rem] p-6 md:p-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl space-y-2">
          <h2 id="como-comprar-title" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
            Cómo comprar
          </h2>
          <p className="text-lg leading-relaxed text-on-surface-variant">
            Somos una tienda 100 % online: sin registros ni carritos, hablas directo con nosotros.
          </p>
        </div>
        <WhatsappLink
          href={generalWhatsappUrl()}
          source="como_comprar"
          className={buttonClasses({ variant: "primary", size: "md", className: "min-h-12 self-start md:self-auto" })}
        >
          <WhatsappIcon className="text-lg" /> Escríbenos
        </WhatsappLink>
      </div>

      <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10">
        {siteConfig.home.steps.map((step, index) => (
          <li key={step.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
            <span className="font-display text-sm font-bold tabular-nums text-primary">0{index + 1}</span>
            <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-on-surface-variant">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
