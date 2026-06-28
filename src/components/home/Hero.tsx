"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { siteConfig } from "@/lib/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

// Alternating ink/pink per heading line for that neobrutalist pop.
const lineColors = ["text-on-background", "text-secondary"];

// Laptop / REVOLT themed stickers that float around the artwork.
const stickers = [
  { icon: "memory", color: "bg-tertiary-container", pos: "-left-5 top-6", rot: -10 },
  { icon: "bolt", color: "bg-accent", pos: "-right-4 top-2", rot: 9 },
  { icon: "sell", color: "bg-secondary-container", pos: "-left-7 bottom-24", rot: -6 },
  { icon: "savings", color: "bg-primary-container", pos: "-right-7 bottom-28", rot: 8 },
];

export function Hero() {
  const { hero } = siteConfig.home;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1) Letters fall from the sky and bounce into place.
        tl.fromTo(
          q("[data-letter]"),
          { autoAlpha: 0, y: -280, rotation: () => gsap.utils.random(-30, 30) },
          {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            ease: "bounce.out",
            duration: 1.1,
            stagger: { each: 0.045, from: "start" },
          },
        )
          // 2) Supporting copy rises in.
          .fromTo(
            q("[data-rise]"),
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.12 },
            "-=0.5",
          )
          // 3) Laptop artwork drops in with a slight overshoot.
          .fromTo(
            q("[data-laptop]"),
            { autoAlpha: 0, y: -40, scale: 0.85, rotation: -6 },
            { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.5)" },
            "-=0.7",
          )
          // 4) Stickers pop to their resting tilt…
          .fromTo(
            q("[data-sticker]"),
            { autoAlpha: 0, scale: 0 },
            {
              autoAlpha: 1,
              scale: 1,
              rotation: (i) => stickers[i % stickers.length].rot,
              duration: 0.5,
              ease: "back.out(2.5)",
              stagger: 0.1,
            },
            "-=0.35",
          );

        // …then keep gently bobbing forever for some life.
        tl.add(() => {
          q("[data-sticker]").forEach((el, i) => {
            gsap.to(el, {
              y: "+=10",
              duration: 1.8 + i * 0.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          });
        });
      },
      root,
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative grid grid-cols-1 items-center gap-12 py-8 lg:grid-cols-2 lg:gap-8 lg:py-12"
    >
      {/* LEFT — copy */}
      <div className="flex flex-col items-start">
        <span
          data-rise
          data-reveal
          className="mb-5 inline-block -rotate-1 border-thin border-on-background bg-surface-container-lowest px-3 py-1 font-label-mono text-label-mono font-bold uppercase shadow-neo-xs"
        >
          {hero.eyebrow}
        </span>

        <h1 className="font-display-xl text-[52px] font-black uppercase leading-[0.9] tracking-tighter sm:text-[68px] lg:text-[80px]">
          {hero.titleLines.map((line, lineIndex) => (
            <span
              key={line}
              className={cn("block", lineColors[lineIndex % lineColors.length])}
            >
              {line.split("").map((char, charIndex) => (
                <span
                  key={`${line}-${charIndex}`}
                  data-letter
                  data-reveal
                  className="inline-block"
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          data-rise
          data-reveal
          className="mt-6 max-w-md border-l-thick border-on-background pl-4 font-body-lg text-body-lg font-bold uppercase"
        >
          {hero.pitch}
        </p>

        <div data-rise data-reveal className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/#inventario" className={buttonClasses({ variant: "accent", size: "lg" })}>
            {hero.ctaLabel} <Icon name="bolt" />
          </Link>
          <span className="flex animate-pulse items-center gap-2 border-thick border-on-background bg-error px-3 py-2 font-label-mono text-label-mono font-bold uppercase text-on-error shadow-neo-xs">
            {hero.flash}
          </span>
        </div>
      </div>

      {/* RIGHT — laptop artwork + stickers */}
      <div className="relative flex items-center justify-center">
        <div data-laptop data-reveal className="relative w-full max-w-md">
          {/* Colored backdrop slabs that peek out behind the laptop card */}
          <div className="absolute -left-4 -top-4 h-full w-full -rotate-3 border-thick border-on-background bg-secondary-container" />
          <div className="absolute -right-3 top-3 h-full w-full rotate-2 bg-tertiary-container opacity-90" />

          {/* The laptop */}
          <div className="relative border-thick border-on-background bg-surface-container-lowest p-6 shadow-neo-lg">
            <LaptopArt />
            {/* "Refurbished" pill, echoing the reference's availability badge */}
            <span className="absolute -bottom-4 right-6 flex items-center gap-1 rotate-2 border-thick border-on-background bg-tertiary-container px-3 py-1 font-label-mono text-label-mono font-bold uppercase text-on-container shadow-neo-xs">
              <span className="h-2 w-2 rounded-full bg-on-container" /> {hero.badge}
            </span>
          </div>

          {/* Floating laptop/REVOLT stickers */}
          {stickers.map((sticker) => (
            <span
              key={sticker.icon}
              data-sticker
              data-reveal
              className={cn(
                "absolute flex h-12 w-12 items-center justify-center border-thick border-on-background text-on-container shadow-neo-sm",
                sticker.color,
                sticker.pos,
              )}
            >
              <Icon name={sticker.icon} className="text-2xl" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Inline neobrutalist laptop illustration — theme-aware via Tailwind fill/stroke. */
function LaptopArt() {
  return (
    <svg
      viewBox="0 0 260 180"
      role="img"
      aria-label="Laptop REVOLT"
      className="h-auto w-full text-on-background"
    >
      {/* Lid / screen */}
      <rect
        x="34"
        y="12"
        width="192"
        height="124"
        className="fill-surface-container-lowest stroke-on-background"
        strokeWidth="6"
      />
      {/* Screen content area */}
      <rect
        x="46"
        y="24"
        width="168"
        height="100"
        className="fill-primary-container stroke-on-background"
        strokeWidth="3"
      />
      {/* Mini dashboard on the screen */}
      <rect x="56" y="34" width="58" height="10" className="fill-on-background" />
      <rect x="56" y="52" width="148" height="8" className="fill-surface-container-lowest stroke-on-background" strokeWidth="2" />
      <rect x="56" y="52" width="96" height="8" className="fill-secondary-container" />
      {/* Bar chart */}
      <rect x="58" y="106" width="16" height="8" className="fill-accent stroke-on-background" strokeWidth="2" />
      <rect x="80" y="92" width="16" height="22" className="fill-tertiary-container stroke-on-background" strokeWidth="2" />
      <rect x="102" y="80" width="16" height="34" className="fill-secondary-container stroke-on-background" strokeWidth="2" />
      <rect x="124" y="72" width="16" height="42" className="fill-accent stroke-on-background" strokeWidth="2" />
      {/* REVOLT wordmark */}
      <text
        x="150"
        y="44"
        className="fill-on-background"
        style={{ font: "900 16px var(--font-display), sans-serif", letterSpacing: "-0.04em" }}
      >
        REVOLT
      </text>
      {/* Base / keyboard deck */}
      <path
        d="M14 136 H246 L260 168 H0 Z"
        className="fill-surface-container stroke-on-background"
        strokeWidth="6"
      />
      {/* Trackpad notch */}
      <rect x="112" y="146" width="36" height="9" className="fill-on-background" />
    </svg>
  );
}
