"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";
import GlassSurface from "@/components/ui/GlassSurface";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const whatsappHref = generalWhatsappUrl();

  // Close the mobile menu on navigation and with the Escape key.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && pathname === href;

  return (
    <header className="sticky top-3 z-50 w-full px-3 md:top-4 md:px-8">
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={40}
        backgroundOpacity={0.72}
        saturation={0.2}
        borderWidth={0.17}
        brightness={50}
        opacity={0.93}
        blur={20}
        displace={0.4}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={-21}
        mixBlendMode="screen"
        className="mx-auto max-w-[75rem] shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        contentClassName="flex w-full items-center justify-between gap-3 px-3 py-2 md:px-5"
      >
        <Link href="/" aria-label={`${siteConfig.name}, ir al inicio`} className="flex shrink-0 items-center rounded-full px-1 py-1">
          <Image
            src="/logo-revolt.png"
            alt={siteConfig.name}
            width={960}
            height={244}
            sizes="150px"
            loading="eager"
            className="h-7 w-auto md:h-8"
          />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2.5 text-[0.9375rem] font-semibold transition-colors duration-150 hover:bg-white/5 hover:text-on-background",
                isActive(item.href) ? "bg-primary/10 text-primary" : "text-on-surface-variant",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WhatsappLink
            href={whatsappHref}
            source="navbar"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-[0.9375rem] font-bold text-on-primary transition-[filter,transform] duration-150 ease-out-strong hover:brightness-110 active:scale-[0.97] md:inline-flex"
          >
            <WhatsappIcon className="text-lg" /> WhatsApp
          </WhatsappLink>
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-[transform,background-color] duration-150 ease-out-strong hover:bg-white/10 active:scale-[0.95] md:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="text-2xl" />
          </button>
        </div>
      </GlassSurface>

      {/* Mobile menu */}
      {/* Opens from the menu button (top-right origin): 200ms in, 150ms out. */}
      <div
        id="menu-movil"
        inert={!open}
        className={cn(
          "absolute inset-x-3 top-[calc(100%+0.5rem)] origin-top-right rounded-3xl border border-white/10 bg-surface/80 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-[opacity,transform,visibility] ease-out-strong motion-reduce:transform-none md:hidden",
          open ? "visible scale-100 opacity-100 duration-200" : "invisible scale-[0.97] opacity-0 duration-150",
        )}
      >
        <nav aria-label="Menú móvil" className="flex flex-col gap-1 p-3">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-semibold text-on-surface transition-colors duration-150 hover:bg-white/5 active:bg-white/10"
            >
              {item.label}
              <Icon name="chevron-right" className="text-on-surface-variant" />
            </Link>
          ))}
          <WhatsappLink
            href={whatsappHref}
            source="menu_movil"
            onClick={() => setOpen(false)}
            className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-base font-bold text-on-primary transition-transform duration-150 ease-out-strong active:scale-[0.97]"
          >
            <WhatsappIcon className="text-xl" /> Escríbenos por WhatsApp
          </WhatsappLink>
        </nav>
      </div>
    </header>
  );
}
