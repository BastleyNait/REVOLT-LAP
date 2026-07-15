"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import GlassSurface from "@/components/ui/GlassSurface";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const whatsappHref = generalWhatsappUrl();
  const headerRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.fromTo(
          headerRef.current,
          { y: -50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power4.out", delay: 0.2 }
        );
      },
      headerRef
    );
    return () => mm.revert();
  }, []);

  return (
    <header ref={headerRef} className="sticky top-4 z-50 w-full px-4 md:px-8">
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={46}
        backgroundOpacity={0.79}
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
        className="mx-auto max-w-[1200px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-500"
        contentClassName="flex w-full items-center justify-between px-5 py-3"
      >
        <Link
          href="/"
          aria-label={siteConfig.name}
          className="group relative z-10 flex items-center gap-2 transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/logo_revolt.svg"
            alt={siteConfig.name}
            width={520}
            height={198}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <nav className="hidden items-center md:flex relative">
          {siteConfig.nav.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "relative z-10 px-5 py-2 text-sm font-medium tracking-wide transition-colors duration-300",
                hoveredIndex === index ? "text-primary" : "text-on-surface-variant hover:text-on-surface",
                item.highlight && "font-semibold text-primary"
              )}
            >
              {item.label}
              {hoveredIndex === index && (
                <span
                  className="absolute inset-0 -z-10 rounded-full bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                  style={{ animation: "fade-in 0.2s ease-out forwards" }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 z-10">
          <ThemeToggle />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-md transition-all duration-300 hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105 md:inline-flex"
          >
            <Icon name="chat" className="text-lg" /> WhatsApp
          </a>
          <Link
            href="/admin"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:scale-105 md:inline-flex"
            title="Admin dashboard"
          >
            <Icon name="settings" className="text-lg" />
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/10 md:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="text-2xl" />
          </button>
        </div>
      </GlassSurface>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute inset-x-4 top-[calc(100%+0.5rem)] overflow-hidden rounded-3xl border border-white/10 bg-surface/60 backdrop-blur-2xl transition-all duration-500 ease-in-out md:hidden",
          open ? "max-h-[400px] opacity-100 shadow-[0_8px_32px_rgba(0,0,0,0.12)]" : "max-h-0 opacity-0 border-transparent shadow-none"
        )}
      >
        <nav className="flex flex-col gap-2 p-4">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-center text-sm font-semibold text-on-surface transition-colors hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-on-primary shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Icon name="chat" /> WhatsApp
          </a>
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-white/10"
          >
            <Icon name="settings" /> Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
