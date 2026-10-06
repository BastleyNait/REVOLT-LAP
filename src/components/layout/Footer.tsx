import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";

export function Footer() {
  const year = new Date().getFullYear();
  const { business, whatsapp } = siteConfig;
  const socials = siteConfig.socials.filter((social) => social.href);

  return (
    <footer className="mt-auto w-full px-4 pb-6 md:px-8">
      <div className="glass mx-auto max-w-[75rem] rounded-[2rem] px-6 py-10 md:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" aria-label={`${siteConfig.name}, ir al inicio`} className="inline-block">
              <Image src="/logo-revolt.png" alt={siteConfig.name} width={960} height={244} sizes="160px" className="h-8 w-auto" />
            </Link>
            <p className="max-w-xs leading-relaxed text-on-surface-variant">
              Tienda online de laptops reacondicionadas en {business.city}. Envíos a todo el {business.countryName}.
            </p>
          </div>

          <nav aria-label="Pie de página" className="space-y-3">
            <h2 className="text-sm font-semibold text-on-surface">Navegación</h2>
            <ul>
              {[{ label: "Inicio", href: "/" }, ...siteConfig.nav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-on-surface-variant transition-colors duration-150 hover:text-on-surface"
                  >
                    {item.label === "Preguntas" ? "Preguntas frecuentes" : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-on-surface">Por qué REVOLT</h2>
            <ul className="space-y-2">
              {siteConfig.trust.map((item) => (
                <li key={item} className="flex items-center gap-2 text-on-surface-variant">
                  <Icon name="check-plain" className="text-primary" strokeWidth={3} /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-on-surface">Atención por WhatsApp</h2>
            <WhatsappLink
              href={generalWhatsappUrl()}
              source="footer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 font-bold text-on-primary transition-[filter,transform] duration-150 ease-out-strong hover:brightness-110 active:scale-[0.97]"
            >
              <WhatsappIcon className="text-lg" /> {whatsapp.display}
            </WhatsappLink>
            {socials.length ? (
              <ul className="flex flex-wrap gap-2 pt-1">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center rounded-full border border-white/10 px-4 text-sm font-semibold text-on-surface-variant transition-colors duration-150 hover:border-white/25 hover:text-on-surface"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-on-surface-variant md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.legalName} · Tienda 100 % online · {business.city}, {business.countryName}
          </p>
          <Link href="/admin" rel="nofollow" className="inline-flex min-h-10 items-center transition-colors duration-150 hover:text-on-surface">
            Administración
          </Link>
        </div>
      </div>
    </footer>
  );
}
