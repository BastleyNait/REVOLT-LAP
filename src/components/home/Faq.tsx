import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { Icon } from "@/components/ui/Icon";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";

/** Native <details> accordion: accessible, crawlable and zero JavaScript. */
export function Faq() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-title" className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div className="space-y-4 lg:sticky lg:top-32">
        <h2 id="preguntas-title" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
          Preguntas frecuentes
        </h2>
        <p className="text-lg leading-relaxed text-on-surface-variant">
          ¿Otra duda?{" "}
          <WhatsappLink
            href={generalWhatsappUrl()}
            source="faq"
            className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors duration-150 hover:decoration-primary"
          >
            Escríbenos por WhatsApp
          </WhatsappLink>{" "}
          y te respondemos.
        </p>
      </div>

      <div className="space-y-3">
        {siteConfig.home.faq.map((item) => (
          <details key={item.question} className="glass group rounded-2xl transition-[border-color] duration-200 open:border-primary/40">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden">
              {item.question}
              <Icon
                name="chevron-down"
                className="text-xl text-primary transition-transform duration-200 ease-out-strong group-open:rotate-180"
              />
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-on-surface-variant">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
