import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsappIcon } from "@/components/ui/Icon";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";
import ClickSpark from "@/components/ClickSpark";

/** Closing call to action: a personal recommendation over WhatsApp. */
export function FinalCta() {
  const { finalCta } = siteConfig.home;

  return (
    <section
      aria-labelledby="cta-title"
      className="glass flex flex-col gap-8 rounded-[2rem] p-7 md:flex-row md:items-center md:justify-between md:p-12"
    >
      <div className="max-w-2xl space-y-3">
        <h2 id="cta-title" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
          {finalCta.title}
        </h2>
        <p className="text-lg leading-relaxed text-on-surface-variant">{finalCta.body}</p>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
        <ClickSpark sparkColor="#12B480" sparkSize={12} sparkRadius={26} sparkCount={10} duration={450}>
          <WhatsappLink
            href={generalWhatsappUrl("Hola REVOLT, ¿me ayudan a elegir una laptop? La necesito para: ")}
            source="cta_final"
            className={buttonClasses({ variant: "primary", size: "lg", className: "min-h-14" })}
          >
            <WhatsappIcon className="text-xl" /> {finalCta.label}
          </WhatsappLink>
        </ClickSpark>
        <p className="text-sm text-on-surface-variant">WhatsApp {siteConfig.whatsapp.display}</p>
      </div>
    </section>
  );
}
