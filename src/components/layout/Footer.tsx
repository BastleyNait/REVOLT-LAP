import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { buttonClasses } from "@/components/ui/Button";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="about" className="w-full px-4 pb-8 pt-12">
      <div className="glass mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 rounded-3xl p-8 shadow-neo md:flex-row md:items-center md:p-10">
        <div className="space-y-2">
          <span className="font-display-lg text-headline-lg-mobile font-black uppercase tracking-tight text-gradient">
            {siteConfig.legalName}
          </span>
          <p className="text-sm text-on-surface-variant">
            © {year} {siteConfig.name} — {siteConfig.tagline}
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {siteConfig.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-4 py-2 text-sm font-semibold text-on-background/75 transition-colors hover:bg-surface-container/60 hover:text-on-background"
            >
              {social.label}
            </a>
          ))}
          <a
            href={generalWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "primary", size: "sm" })}
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
