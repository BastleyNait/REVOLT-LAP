import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { formatPrice } from "@/lib/utils/format";
import { buttonClasses } from "@/components/ui/Button";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";
import ShinyText from "@/components/ShinyText";
import ClickSpark from "@/components/ClickSpark";
import { HeroLogo } from "./HeroLogo";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Home hero — the store's original composition: full-bleed photo, the big
 * REVOLT logo, tracked-caps title (the page <h1>), frosted stats bar and CTAs.
 * React Bits: ElectricLogo on the mark, ShinyText on the title, ClickSpark on
 * the CTAs. Entrance is a CSS stagger; reduced motion skips every effect.
 */
export function Hero({ minPrice }: { minPrice: number | null }) {
  const { hero } = siteConfig.home;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative z-[1] -mt-[4.75rem] flex min-h-[100svh] w-full items-center justify-center overflow-hidden md:-mt-20"
    >
      <Image
        src="/laptop_ultra_4k_hd_desktop_background-3840x2160.jpg"
        alt=""
        fill
        loading="eager"
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(150deg,rgba(0,0,0,0.78)_0%,rgba(0,4,2,0.58)_55%,rgba(0,8,5,0.70)_100%)]"
      />
      {/* Bottom fade into the page background */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-64 bg-gradient-to-b from-transparent to-background" />

      <div className="relative z-10 mx-auto w-full max-w-[75rem] px-4 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
        <div className="flex flex-col items-start lg:max-w-[65%]">
          <span className="animate-enter mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
            {hero.eyebrow}
          </span>

          <div className="animate-enter mb-4 w-full max-w-[32.5rem]" style={delay(50)}>
            <HeroLogo />
          </div>

          <h1 id="hero-title" className="mb-2 text-[clamp(1rem,3vw,1.5rem)] font-bold uppercase tracking-[0.18em]">
            <ShinyText text={hero.title} color="#12B480" shineColor="#d6fff0" speed={2.8} delay={2} spread={110} />
          </h1>

          <p className="animate-enter mt-8 max-w-xl text-lg font-medium leading-relaxed text-white/80 drop-shadow-md md:text-xl" style={delay(100)}>
            {hero.pitch}
          </p>

          {/* Frosted stats bar */}
          <ul
            className="animate-enter mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl border border-white/15 bg-black/20 px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl"
            style={delay(150)}
          >
            {hero.stats.map((stat) => (
              <li key={stat.label} className="flex items-center gap-2 text-sm font-bold text-white/90">
                <Icon name={stat.icon} className="text-lg text-primary" />
                {stat.label}
              </li>
            ))}
          </ul>

          <div className="animate-enter mt-10 flex flex-wrap items-center gap-4" style={delay(200)}>
            <ClickSpark sparkColor="#12B480" sparkSize={12} sparkRadius={24} sparkCount={10} duration={450}>
              <Link
                href="/#laptops"
                className={buttonClasses({ variant: "primary", size: "lg", className: "shadow-[0_0_20px_rgb(var(--c-primary)/0.4)]" })}
              >
                {hero.ctaLabel} <Icon name="arrow" />
              </Link>
            </ClickSpark>
            <ClickSpark sparkColor="#12B480" sparkSize={12} sparkRadius={24} sparkCount={10} duration={450}>
              <WhatsappLink
                href={generalWhatsappUrl()}
                source="hero"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-md transition-[transform,background-color,border-color] duration-150 ease-out-strong hover:border-white/30 hover:bg-white/10 active:scale-[0.97]"
              >
                <WhatsappIcon className="text-lg" /> WhatsApp
              </WhatsappLink>
            </ClickSpark>
            {hero.flash ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-5 py-2.5 text-sm font-bold text-accent shadow-[0_0_15px_rgb(var(--c-accent)/0.2)] backdrop-blur-md">
                <Icon name="flame" className="text-xl" />
                {hero.flash}
              </span>
            ) : null}
          </div>

          {minPrice ? (
            <p className="animate-enter mt-8 text-xs font-bold uppercase tracking-[0.3em] text-white/50" style={delay(250)}>
              Desde {formatPrice(minPrice)}
            </p>
          ) : null}
        </div>
      </div>

      {/* Scroll indicator */}
      <div aria-hidden className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-60 md:flex">
        <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-white">Descubre más</span>
        <span className="h-10 w-[2px] rounded-full bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}
