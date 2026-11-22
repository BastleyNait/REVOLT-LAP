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
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils/cn";
import { HeroLogo } from "./HeroLogo";
import { FeaturedShowcase } from "./FeaturedShowcase";
import { HeroBackground } from "./HeroBackground";
import { FreeShippingCard } from "./FreeShippingCard";
import { RealShipmentsSlider } from "./RealShipmentsSlider";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Home hero — the store's original composition: full-bleed photo, the big
 * REVOLT logo, tracked-caps title (the page <h1>), frosted stats bar and CTAs.
 * React Bits: ElectricLogo on the mark, ShinyText on the title, ClickSpark on
 * the CTAs. Entrance is a CSS stagger; reduced motion skips every effect.
 */
export function Hero({ minPrice, featured }: { minPrice: number | null; featured: Product[] }) {
  const { hero } = siteConfig.home;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative z-[1] -mt-[4.75rem] flex min-h-[100svh] w-full items-center justify-center overflow-hidden md:-mt-20"
    >
      <HeroBackground />
      {/* Bottom fade into the page background */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-64 bg-gradient-to-b from-transparent to-background" />

      <div className="relative z-10 mx-auto w-full max-w-[75rem] px-4 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40 short:pb-6 short:pt-24 wide:max-w-[min(92vw,120rem)]">
        <div className="flex flex-col items-start lg:max-w-[65%] wide:max-w-[58%]">

          <div className="animate-enter mb-4 w-full max-w-[32.5rem] short:mb-2 short:max-w-[21rem] wide:max-w-[38rem]" style={delay(50)}>
            <HeroLogo />
          </div>

          <h1 id="hero-title" className="mb-2 text-[clamp(1rem,3vw,1.5rem)] short:mb-0 short:text-lg wide:text-[1.75rem] font-bold uppercase tracking-[0.18em]">
            <ShinyText text={hero.title} color="#12B480" shineColor="#d6fff0" speed={2.8} delay={2} spread={110} />
          </h1>

          <p className="animate-enter mt-8 max-w-xl text-lg font-medium leading-relaxed text-white/80 drop-shadow-md md:text-xl short:mt-4 short:text-lg wide:max-w-[44rem] wide:text-[1.4rem]" style={delay(100)}>
            {hero.pitch}
          </p>

          {/*
           * Proof: concrete, checkable facts (warranty, how payment works).
           * Two equal columns on every width so nothing runs off a phone screen;
           * on phones the caption sits under the number, from sm up beside it.
           */}
          <dl className="animate-enter mt-8 short:mt-5 grid w-full max-w-xl grid-cols-2 wide:max-w-[44rem] gap-x-4 gap-y-6 sm:gap-x-8" style={delay(125)}>
            {hero.proof.map((item, i) => (
              <div
                key={item.label}
                className={cn(
                  "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4",
                  i > 0 && "border-l border-primary/40 pl-4 sm:border-0 sm:pl-0",
                )}
              >
                {i > 0 ? (
                  <span aria-hidden className="order-first hidden h-12 w-px shrink-0 bg-gradient-to-b from-transparent via-primary/70 to-transparent sm:block" />
                ) : null}
                <dt className="text-xs font-bold uppercase leading-snug tracking-[0.14em] text-white/80 sm:max-w-[9rem] sm:text-sm sm:tracking-[0.18em]">
                  {item.label}
                </dt>
                <dd className="order-first whitespace-nowrap font-display text-5xl font-extrabold leading-none tracking-tight text-primary drop-shadow-[0_0_28px_rgb(var(--c-primary)/0.5)] md:text-6xl short:text-5xl wide:text-7xl">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="animate-enter mt-9 short:mt-5 flex flex-wrap items-center gap-4" style={delay(200)}>
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
                className="inline-flex items-center gap-2 rounded-full bg-[#080d0b] px-8 py-3.5 text-sm font-bold text-white transition-[transform,background-color] duration-150 ease-out-strong hover:bg-[#121a16] active:scale-[0.97]"
              >
                <WhatsappIcon className="text-lg" /> WhatsApp
              </WhatsappLink>
            </ClickSpark>
            <FreeShippingCard />
          </div>

          <div className="animate-enter mt-6 short:mt-2 flex flex-wrap items-center gap-x-6 gap-y-3" style={delay(250)}>
            <RealShipmentsSlider href="/nuestros-envios" label={hero.shipmentsLink} hint={hero.shipmentsHint} />
            <Link
              href={siteConfig.home.purchasePage.path}
              className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-white underline decoration-primary/60 underline-offset-4 transition-colors duration-150 hover:text-primary"
            >
              <Icon name="shield" className="text-lg text-primary" /> {hero.safeLink}
            </Link>
            {minPrice ? (
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">Desde {formatPrice(minPrice)}</p>
            ) : null}
          </div>
        </div>

        {/* Featured carousel: right column on desktop, below the CTAs on phones/tablets. */}
        {featured.length ? (
          <div className="mt-12 w-full max-w-[26rem] lg:absolute lg:right-8 lg:top-1/2 lg:mt-0 lg:w-[23rem] lg:max-w-none lg:-translate-y-1/2 xl:w-[26.5rem] short:top-[calc(50%+2.5rem)] short:xl:w-[23rem] wide:top-[calc(50%+1.5rem)] wide:w-[30%]">
            <div className="animate-enter relative" style={delay(300)}>
              <FeaturedShowcase products={featured} />
            </div>
          </div>
        ) : null}
      </div>

      {/* Scroll indicator */}
      <div aria-hidden className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-60 md:flex short:hidden">
        <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-white">Descubre más</span>
        <span className="h-10 w-[2px] rounded-full bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}
