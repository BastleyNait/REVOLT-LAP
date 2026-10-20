"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/types/product";
import { SafeImage } from "@/components/ui/SafeImage";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

const ZOOM = 2.2;
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * One carousel photo with hover zoom: on a mouse (precise pointer), hovering
 * magnifies the photo around the cursor so the buyer can inspect scratches,
 * keyboard wear or the screen. A high-resolution copy is requested only while
 * zoomed — the normal photo is sized for the layout (≤ 680px) and would look
 * blurry at 2x. Touch devices keep plain swipe: no zoom, nothing extra loaded.
 */
function ZoomableSlide({ image, alt, label, first }: { image: string; alt: string; label: string; first: boolean }) {
  const [zoomed, setZoomed] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const origin = useRef("50% 50%");

  // The origin follows the cursor through the DOM directly: re-rendering on
  // every mousemove would be wasted work for a value only CSS reads.
  const track = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    origin.current = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
    if (layerRef.current) layerRef.current.style.transformOrigin = origin.current;
  };

  return (
    <div
      role="group"
      aria-roledescription="foto"
      aria-label={label}
      className="relative aspect-[4/3] w-full shrink-0 snap-center overflow-hidden [@media(hover:hover)_and_(pointer:fine)]:cursor-zoom-in"
      onMouseEnter={(event) => {
        if (!window.matchMedia(FINE_POINTER).matches) return;
        track(event);
        setZoomed(true);
      }}
      onMouseMove={zoomed ? track : undefined}
      onMouseLeave={() => setZoomed(false)}
    >
      <div
        ref={layerRef}
        className="absolute inset-0 transition-transform duration-200 ease-out-strong motion-reduce:transition-none"
        style={{ transform: zoomed ? `scale(${ZOOM})` : undefined, transformOrigin: origin.current }}
      >
        <SafeImage
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, (min-width: 1921px) 36vw, 680px"
          loading={first ? "eager" : "lazy"}
          fetchPriority={first ? "high" : undefined}
          draggable={false}
          className="object-contain"
        />
        {zoomed ? (
          <SafeImage src={image} alt="" aria-hidden fill sizes="1600px" draggable={false} className="object-contain" />
        ) : null}
      </div>
    </div>
  );
}

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
            <ZoomableSlide
              key={`${image}-${index}`}
              image={image}
              alt={total > 1 ? `${alt} — foto ${index + 1} de ${total}` : alt}
              label={`${index + 1} de ${total}`}
              first={index === 0}
            />
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
