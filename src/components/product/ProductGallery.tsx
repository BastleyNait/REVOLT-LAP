"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/types/product";
import { SafeImage } from "@/components/ui/SafeImage";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

/**
 * Product photo carousel. The main track is native horizontal scroll with
 * scroll-snap (real swipe physics on phones, no gesture library) and hidden
 * scrollbars. Arrows only render for precise pointers; keyboard navigation
 * jumps instantly (keyboard actions never animate).
 */
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const gallery = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const total = gallery.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLUListElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track) return;
      setActive(Math.round(track.scrollLeft / track.clientWidth));
    });
  }, []);

  const goTo = useCallback(
    (index: number, instant = false) => {
      const track = trackRef.current;
      if (!track) return;
      const next = (index + total) % total;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: next * track.clientWidth, behavior: instant || reduce ? "auto" : "smooth" });
    },
    [total],
  );

  // Keep the active thumbnail in view without scrolling the page vertically.
  useEffect(() => {
    const list = thumbsRef.current;
    const thumb = list?.children[active] as HTMLElement | undefined;
    if (!list || !thumb) return;
    list.scrollTo({ left: thumb.offsetLeft - (list.clientWidth - thumb.clientWidth) / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") goTo(active + 1, true);
    else if (event.key === "ArrowLeft") goTo(active - 1, true);
    else return;
    event.preventDefault();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="glass relative overflow-hidden rounded-3xl p-2 md:p-3">
        <div
          ref={trackRef}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label={`Fotos de ${alt}`}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl bg-surface-container outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {gallery.map((image, index) => (
            <div
              key={`${image}-${index}`}
              role="group"
              aria-roledescription="foto"
              aria-label={`${index + 1} de ${total}`}
              className="relative aspect-[4/3] w-full shrink-0 snap-center"
            >
              <SafeImage
                src={image}
                alt={total > 1 ? `${alt} — foto ${index + 1} de ${total}` : alt}
                fill
                sizes="(max-width: 1024px) 100vw, (min-width: 1921px) 36vw, 680px"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
                draggable={false}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Foto anterior"
              className="absolute left-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition-[transform,background-color] duration-150 ease-out-strong hover:bg-black/70 active:scale-[0.95] [@media(hover:hover)_and_(pointer:fine)]:flex"
            >
              <Icon name="chevron-right" className="rotate-180 text-2xl" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Foto siguiente"
              className="absolute right-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition-[transform,background-color] duration-150 ease-out-strong hover:bg-black/70 active:scale-[0.95] [@media(hover:hover)_and_(pointer:fine)]:flex"
            >
              <Icon name="chevron-right" className="text-2xl" />
            </button>
            <p
              aria-live="polite"
              className="pointer-events-none absolute bottom-5 right-5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur-md"
            >
              {active + 1} / {total}
            </p>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <ul
          ref={thumbsRef}
          aria-label="Miniaturas"
          className="scrollbar-none flex gap-2 overflow-x-auto overscroll-x-contain px-0.5 py-0.5"
        >
          {gallery.map((image, index) => (
            <li key={`${image}-${index}`} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ver foto ${index + 1}`}
                aria-current={active === index}
                className={cn(
                  "relative block h-16 w-20 overflow-hidden rounded-xl border-2 transition-[opacity,border-color,transform] duration-150 ease-out-strong active:scale-[0.96] md:h-[4.5rem] md:w-24",
                  active === index ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <SafeImage src={image} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
