"use client";

import { useEffect } from "react";
import { downgradeFx, getFxTier, hasManualFx } from "@/lib/utils/fx-client";

/** Tarjetas gráficas que no aguantan desenfoques ni WebGL a 60 fps. */
const WEAK_GPU_RE = /swiftshader|llvmpipe|softpipe|software|microsoft basic|powervr|mali|adreno|intel.*\b(?:hd|uhd) graphics/i;

function hasWeakGpu(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return true;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return WEAK_GPU_RE.test(renderer);
  } catch {
    return false;
  }
}

/** Milisegundos entre cuadros. `onlyWhile` filtra los cuadros que cuentan (p. ej. solo durante scroll). */
function measureFrames(count: number, onlyWhile: () => boolean, maxMs: number): Promise<number[] | null> {
  return new Promise((resolve) => {
    const deltas: number[] = [];
    const started = performance.now();
    let last = 0;
    let skipped = 0;

    const tick = (now: number) => {
      if (document.hidden) return resolve(null); // en segundo plano el navegador frena los cuadros
      if (last && onlyWhile()) {
        // Los primeros cuadros cargan shaders y texturas: no son representativos.
        if (skipped < 6) skipped += 1;
        else deltas.push(now - last);
      }
      last = now;
      if (deltas.length >= count) return resolve(deltas);
      if (now - started > maxMs) return resolve(deltas.length >= count / 2 ? deltas : null);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function isSlow(deltas: number[] | null): boolean {
  if (!deltas) return false;
  const sorted = [...deltas].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length * 0.5)];
  const p90 = sorted[Math.floor(sorted.length * 0.9)];
  // Mediana > 26 ms ≈ menos de ~38 fps; p90 > 55 ms o más de un cuarto de los cuadros
  // pasados de 33 ms = tirones visibles.
  const slowShare = deltas.filter((delta) => delta > 33).length / deltas.length;
  return median > 26 || p90 > 55 || slowShare > 0.25;
}

/**
 * Segunda opinión sobre el nivel "rich": revisa la tarjeta gráfica y mide los
 * FPS reales, primero con los efectos en marcha (poco después de la primera
 * interacción, cuando arranca el rayo del logo) y luego durante el scroll.
 * Si el equipo no da, baja a "lite" sin recargar. No hace nada si el nivel ya es
 * "lite" o si se fijó a mano con ?fx=.
 */
export function FxMonitor() {
  useEffect(() => {
    if (getFxTier() !== "rich" || hasManualFx()) return;

    let cancelled = false;
    let lastScroll = 0;
    const INTERACTION = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    const timers: number[] = [];

    const onScroll = () => {
      lastScroll = performance.now();
    };

    const finish = () => {
      cancelled = true;
      INTERACTION.forEach((type) => window.removeEventListener(type, begin));
      window.removeEventListener("scroll", onScroll);
      timers.forEach((id) => window.clearTimeout(id));
    };

    const verdict = (slow: boolean) => {
      if (cancelled) return false;
      if (slow) {
        downgradeFx();
        finish();
        return true;
      }
      return false;
    };

    let started = false;
    async function probe() {
      if (cancelled || started) return;
      started = true;
      if (hasWeakGpu()) return void verdict(true);

      // 1) Con los efectos en marcha, quieto.
      const idle = await measureFrames(70, () => true, 5000);
      if (verdict(isSlow(idle))) return;

      // 2) Durante el scroll (donde más se nota el vidrio): espera hasta 20 s a que haya scroll.
      const scrolling = await measureFrames(50, () => performance.now() - lastScroll < 120, 20000);
      if (verdict(isSlow(scrolling))) return;
      finish();
    }

    // Arranca poco después de la primera interacción (o a los 8 s si no hay ninguna).
    function begin() {
      INTERACTION.forEach((type) => window.removeEventListener(type, begin));
      timers.push(window.setTimeout(probe, 1800));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    INTERACTION.forEach((type) => window.addEventListener(type, begin, { once: true, passive: true }));
    timers.push(
      window.setTimeout(() => {
        INTERACTION.forEach((type) => window.removeEventListener(type, begin));
        void probe();
      }, 8000),
    );

    return finish;
  }, []);

  return null;
}
