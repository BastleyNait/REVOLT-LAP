"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config/site";
import { canRunRichEffects } from "@/lib/utils/device";

// React Bits — ElectricLogo (WebGL via ogl). Loaded after hydration so the
// static logo paints first and stays the LCP element.
const ElectricLogo = dynamic(() => import("@/components/ElectricLogo"), { ssr: false });

/**
 * Where the R-bolt mark sits inside /logo-revolt.png (960×244): the first
 * 24.271% of the width, full height. The lightning canvas is twice the mark's
 * size, centred on it, with `scale={0.5}` so the traced outline lands exactly
 * on the mark and the glow has room to spill out.
 */
const MARK_WIDTH = 24.271;
const SPREAD = 2;

export function HeroLogo() {
  const [electric, setElectric] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let idle = 0;
    const INTERACTION = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;

    // The lightning (WebGL, ~70 KB of JS plus a shader running every frame)
    // waits for the visitor's first interaction: the page becomes usable first
    // and the effect never competes with loading. With a mouse that is almost
    // immediate. Modest devices (few cores, little memory, data saver, reduce
    // motion) keep the static logo with its glow — on those the effect was lag.
    const start = () => {
      INTERACTION.forEach((type) => window.removeEventListener(type, start));
      if (!canRunRichEffects()) return;
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(() => setElectric(true), { timeout: 1000 });
      else setElectric(true);
    };
    const onMotionChange = () => {
      if (reduce.matches) setElectric(false);
    };

    INTERACTION.forEach((type) => window.addEventListener(type, start, { once: true, passive: true }));
    reduce.addEventListener("change", onMotionChange);

    return () => {
      INTERACTION.forEach((type) => window.removeEventListener(type, start));
      reduce.removeEventListener("change", onMotionChange);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  return (
    <div className="relative w-full">
      <Image
        src="/logo-revolt.png"
        alt={siteConfig.name}
        width={960}
        height={244}
        loading="eager"
        fetchPriority="high"
        sizes="(max-width: 640px) 90vw, (min-width: 1921px) 28vw, 520px"
        className="relative h-auto w-full drop-shadow-[0_0_40px_rgba(0,160,118,0.35)]"
      />
      {electric ? (
        <div
          aria-hidden
          className="absolute"
          style={{
            width: `${MARK_WIDTH * SPREAD}%`,
            height: `${100 * SPREAD}%`,
            left: `${MARK_WIDTH / 2 - (MARK_WIDTH * SPREAD) / 2}%`,
            top: `${50 - (100 * SPREAD) / 2}%`,
          }}
        >
          <ElectricLogo
            src="/logo-mark.png"
            resolution={240}
            scale={1 / SPREAD}
            color="#c8ffe9"
            glowColor="#12B480"
            intensity={0.9}
            glow={1.1}
            thickness={1.2}
            strands={3}
            bend={0.5}
            crackle={1.2}
            arcs={0.7}
            flicker={0.45}
            speed={1.6}
            cursorIntensity={0.8}
            cursorRadius={90}
          />
        </div>
      ) : null}
    </div>
  );
}
