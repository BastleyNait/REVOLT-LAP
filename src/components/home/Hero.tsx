"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

const stats = [
  { icon: "inventory_2",    label: "Stock disponible" },
  { icon: "local_shipping", label: "Envío rápido" },
  { icon: "shield",         label: "Funcionamiento garantizado" },
  { icon: "payments",       label: "Precio insuperable" },
];

export function Hero() {
  const { hero } = siteConfig.home;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-rise]",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out" },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative z-[1] flex min-h-screen w-full -mt-24 items-center justify-center overflow-hidden"
    >
      {/* Foto de fondo */}
      <Image
        src="/laptop_ultra_4k_hd_desktop_background-3840x2160.jpg"
        alt="Laptop de alto rendimiento"
        fill
        priority
        quality={90}
        className="object-cover object-center scale-105 transform transition-transform duration-[20s] hover:scale-110"
        sizes="100vw"
      />

      <div
        className="absolute inset-0"
        suppressHydrationWarning
        style={{
          background:
            "linear-gradient(150deg, rgba(0,0,0,0.78) 0%, rgba(0,4,2,0.58) 55%, rgba(0,8,5,0.70) 100%)",
        }}
      />

      {/* Fade inferior — integra la imagen con el fondo de la página */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 z-10"
        suppressHydrationWarning
        style={{ background: "linear-gradient(to bottom, transparent, rgb(1 2 1))" }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pt-32 pb-24 md:px-8 md:pt-40 md:pb-32">
        <div className="flex flex-col items-start lg:max-w-[65%]">

          {/* Eyebrow */}
          <span
            data-rise
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            {hero.eyebrow}
          </span>

          {/* Logo principal — grande, sobre el fondo */}
          <div data-rise className="mb-4 w-full max-w-[520px]">
            <Image
              src="/logo_revolt.svg"
              alt="REVOLT"
              width={520}
              height={198}
              priority
              className="w-full h-auto drop-shadow-[0_0_40px_rgba(0,160,118,0.35)]"
            />
          </div>

          {/* Subtítulo: LAPTOPS REACONDICIONADAS */}
          <p
            data-rise
            className="text-[clamp(1rem,3vw,1.5rem)] font-black uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mb-2"
          >
            Laptops Reacondicionadas
          </p>

          {/* Pitch */}
          <p data-rise className="mt-8 max-w-xl text-lg md:text-xl leading-relaxed text-white/80 drop-shadow-md font-medium">
            {hero.pitch}
          </p>

          {/* Stats */}
          <div
            data-rise
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl border border-white/15 bg-black/20 px-6 py-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          >
            {stats.map((stat) => (
              <span key={stat.label} className="flex items-center gap-2 text-sm font-bold text-white/90">
                <Icon name={stat.icon} className="text-lg text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                {stat.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div data-rise className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/#inventario" className={cn(buttonClasses({ variant: "primary", size: "lg" }), "shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--primary),0.6)]")}>
              {hero.ctaLabel} <Icon name="arrow_forward" className="ml-1" />
            </Link>
            <a
              href={generalWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
            >
              <Icon name="chat" className="transition-transform group-hover:scale-110" /> WhatsApp
            </a>

            {hero.flash && (
              <span data-rise className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-5 py-2.5 text-sm font-bold text-accent backdrop-blur-md shadow-[0_0_15px_rgba(var(--accent),0.2)]">
                <Icon name="local_fire_department" className="text-xl animate-pulse" />
                {hero.flash}
              </span>
            )}
          </div>

          {/* Badge de precio */}
          <p data-rise className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
            {hero.badge}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 opacity-60 transition-opacity hover:opacity-100">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Descubre más</span>
        <span className="h-10 w-[2px] rounded-full bg-gradient-to-b from-primary to-transparent animate-pulse" />
      </div>
    </section>
  );
}
