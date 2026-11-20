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
export function CarouselTrack({
  slides,
  label,
  heading,
  itemLabel = "la laptop",
}: {
  slides: ReactNode[];
  label: string;
  heading: ReactNode;
  /** Used in the dots' labels: "Ir a {itemLabel} 2". */
  itemLabel?: string;
}) {
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
      className="relative isolate p-3"
    >
      {/* Panel without edges: a dark tint plus a green glow, both fading out on
          every side (mask), so the carousel melts into the hero background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 [background:radial-gradient(80%_60%_at_70%_15%,rgb(18_180_128/0.16),transparent_70%),rgb(2_12_8/0.9)] [mask-image:radial-gradient(farthest-side,#000_72%,transparent)]"
      />
      <div className="mb-2 flex items-center justify-between gap-3 px-2 pt-1">
        {heading}
        {count > 1 ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => step(-1)}
              className="grid size-9 cursor-pointer place-items-center rounded-full bg-white/[0.06] text-white/80 transition-[transform,background-color] duration-150 ease-out-strong hover:bg-white/[0.12] active:scale-[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <Icon name="chevron-left" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => step(1)}
              className="grid size-9 cursor-pointer place-items-center rounded-full bg-white/[0.06] text-white/80 transition-[transform,background-color] duration-150 ease-out-strong hover:bg-white/[0.12] active:scale-[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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
              aria-label={`Ir a ${itemLabel} ${i + 1}`}
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
