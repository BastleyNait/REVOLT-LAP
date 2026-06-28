import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { cn } from "@/lib/utils/cn";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="about"
      className="w-full border-t-heavy border-on-background bg-on-background text-surface bg-dots"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-gutter px-4 py-12 md:flex-row md:items-center md:px-margin-edge">
        <div className="space-y-2">
          <span className="inline-block -rotate-2 bg-on-container px-1 font-display-lg text-headline-lg-mobile font-black uppercase text-primary-fixed">
            {siteConfig.legalName}
          </span>
          <p className="font-label-mono text-label-mono font-bold opacity-80">
            © {year} {siteConfig.name} — {siteConfig.tagline.toUpperCase()}
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-6 font-label-mono text-body-md font-bold uppercase">
          {siteConfig.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-secondary-container hover:underline"
            >
              {social.label}
            </a>
          ))}
          <a
            href={generalWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "border-thick border-surface bg-surface px-4 py-2 text-on-background transition-all",
              "hover:bg-secondary-container hover:border-secondary-container",
            )}
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
