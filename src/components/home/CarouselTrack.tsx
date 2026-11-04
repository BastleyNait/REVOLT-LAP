"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

const AUTOPLAY_MS = 5000;
/** After the visitor touches the carousel, autoplay stays quiet for this long. */
const IDLE_MS = 9000;

/**
 * Scroll-snap carousel (native swipe/trackpad scrolling) with prev/next
 * buttons, dots and a gentle autoplay. The slides are server-rendered and come
 * in as `slides`; this component only owns the scrolling behaviour.
 * Autoplay is off for `prefers-reduced-motion`, and pauses on hover/focus, after
 * any touch, in background tabs and while the carousel is off-screen.
 */
export function CarouselTrack({ slides, label, heading }: { slides: ReactNode[]; label: string; heading: ReactNode }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const hovered = useRef(false);
  const visible = useRef(true);
  const lastTouch = useRef(0);
  const count = slides.length;

  const goTo = useCallback((next: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: next * track.clientWidth, behavior: reduce ? "auto" : behavior });
  }, []);

  // Keep `index` in sync with native scrolling (swipe, trackpad, keyboard).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
        indexRef.current = next;
        setIndex(next);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Autoplay.
  useEffect(() => {
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    const observer = root ? new IntersectionObserver(([entry]) => (visible.current = entry.isIntersecting)) : null;
    if (root) observer?.observe(root);

    const timer = setInterval(() => {
      if (hovered.current || !visible.current || document.hidden) return;
      if (Date.now() - lastTouch.current < IDLE_MS) return;
      goTo((indexRef.current + 1) % count);
    }, AUTOPLAY_MS);

    return () => {
      clearInterval(timer);
      observer?.disconnect();
    };
  }, [count, goTo]);

  const markTouched = () => {
    lastTouch.current = Date.now();
  };
  const step = (delta: number) => {
    markTouched();
    goTo((index + delta + count) % count);
  };

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hovered.current = true;
      }}
      onPointerLeave={() => (hovered.current = false)}
      onFocus={() => (hovered.current = true)}
      onBlur={() => (hovered.current = false)}
      onTouchStart={markTouched}
      className="fx-panel rounded-[2rem] border border-white/15 bg-black/25 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        {heading}
        {count > 1 ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => step(-1)}
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-[transform,background-color,border-color] duration-150 ease-out-strong hover:border-white/30 hover:bg-white/10 active:scale-[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <Icon name="chevron-left" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => step(1)}
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-[transform,background-color,border-color] duration-150 ease-out-strong hover:border-white/30 hover:bg-white/10 active:scale-[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <Icon name="chevron-right" />
            </button>
          </div>
        ) : null}
      </div>

      <ul
        ref={trackRef}
        aria-live="off"
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [touch-action:pan-x_pan-y_pinch-zoom]"
      >
        {slides.map((slide, i) => (
          <li
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
            className="w-full shrink-0 snap-center snap-always"
          >
            {slide}
          </li>
        ))}
      </ul>

      {count > 1 ? (
        <div className="mt-2 flex justify-center">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a la laptop ${i + 1}`}
              aria-current={i === index}
              onClick={() => {
                markTouched();
                goTo(i);
              }}
              className="group grid h-6 w-6 cursor-pointer place-items-center focus-visible:outline-none"
            >
              <span
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out-strong group-focus-visible:ring-2 group-focus-visible:ring-primary/60",
                  i === index ? "w-5 bg-primary" : "w-1.5 bg-white/30 group-hover:bg-white/50",
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
