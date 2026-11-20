"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

const PLANE = "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z";
const KNOB = 40; // px, the plane
const PAD = 4; // px, track padding
const THRESHOLD = 0.9; // fraction of the track that counts as "arrived"

/**
 * "Mira nuestros envíos reales" as a slide-to-go control: drag the plane to
 * the destination pin at the end of the track and it takes you to the page.
 * Tapping the label (a real link) or pressing Enter / → on the plane works too,
 * so it never depends on dragging. Idle: the plane nudges and the route
 * dashes march; both stop with prefers-reduced-motion.
 */
export function RealShipmentsSlider({ href, label, hint, className }: { href: string; label: string; hint: string; className?: string }) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ pointer: number; from: number } | null>(null);
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  const maxX = useCallback(() => Math.max(0, (trackRef.current?.clientWidth ?? 0) - KNOB - PAD * 2), []);

  const arrive = useCallback(() => {
    setX(maxX());
    setArrived(true);
    window.setTimeout(() => router.push(href), 260);
  }, [href, maxX, router]);

  const onDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (arrived) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { pointer: e.clientX, from: x };
    setDragging(true);
  };
  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!start.current) return;
    setX(Math.min(maxX(), Math.max(0, start.current.from + e.clientX - start.current.pointer)));
  };
  const onUp = () => {
    if (!start.current) return;
    start.current = null;
    setDragging(false);
    if (x >= maxX() * THRESHOLD && maxX() > 0) arrive();
    else setX(0);
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!arrived) arrive();
    }
  };

  const progress = maxX() ? x / maxX() : 0;

  return (
    <div className={`inline-flex flex-col items-start gap-1.5 short:flex-row short:items-center short:gap-3 ${className ?? ""}`}>
      <style>{`
        .rs-knob{transition:transform .38s cubic-bezier(.22,1,.36,1)}
        .rs-knob[data-drag="true"]{transition:none}
        .rs-idle{animation:rsNudge 3.4s ease-in-out infinite}
        @keyframes rsNudge{0%,62%,100%{transform:translateX(0)}72%{transform:translateX(9px)}82%{transform:translateX(0)}90%{transform:translateX(5px)}}
        .rs-route{animation:rsMarch 1.1s linear infinite}
        @keyframes rsMarch{to{stroke-dashoffset:-14}}
        .rs-hint{animation:rsHint 2.6s ease-in-out infinite}
        @keyframes rsHint{0%,100%{opacity:.4}50%{opacity:.85}}
        .rs-pin{animation:rsPin 2s ease-out infinite}
        @keyframes rsPin{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.4);opacity:0}}
        @media (prefers-reduced-motion: reduce){.rs-knob{transition:none}.rs-idle,.rs-route,.rs-hint,.rs-pin{animation:none}.rs-pin{opacity:0}}
      `}</style>

      <div
        ref={trackRef}
        className="relative h-12 w-[min(21rem,calc(100vw-2rem))] select-none overflow-hidden rounded-full bg-[#080d0b]"
        style={{ padding: PAD }}
      >
        {/* covered part of the route */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,rgb(18_180_128/0.05),rgb(18_180_128/0.38))]"
          style={{ width: x + KNOB + PAD, transition: dragging ? "none" : "width .38s cubic-bezier(.22,1,.36,1)" }}
        />
        {/* dotted route */}
        <svg
          aria-hidden
          className="absolute inset-x-5 top-1/2 h-1 -translate-y-1/2"
          width="100%"
          height="4"
          preserveAspectRatio="none"
          style={{ opacity: Math.min(1, 0.25 + progress * 1.2) }}
        >
          <line x1="0" y1="2" x2="100%" y2="2" stroke="rgb(47 224 166 / 0.5)" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" className="rs-route" />
        </svg>

        {/* label: fades as the plane passes. A real link: tap, keyboard and crawlers. */}
        <Link
          href={href}
          tabIndex={-1}
          className="absolute inset-y-0 left-[3.4rem] right-11 z-[1] flex items-center rounded-full bg-[#080d0b] pl-1 text-[0.9375rem] font-bold text-white"
          style={{ opacity: Math.max(0, 1 - progress * 1.6) }}
        >
          <span className="truncate">{label}</span>
        </Link>

        {/* destination pin */}
        <span aria-hidden className="absolute right-3.5 top-1/2 z-[1] flex h-3 w-3 -translate-y-1/2">
          <span className="rs-pin absolute inset-0 rounded-full bg-primary" />
          <span className="relative h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgb(var(--c-primary)/0.9)]" />
        </span>

        {/* the plane */}
        <button
          type="button"
          role="button"
          aria-label={`${label}: desliza hacia la derecha o presiona Enter`}
          data-drag={dragging}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
          className={`rs-knob relative z-[2] grid cursor-grab place-items-center rounded-full bg-primary text-[#031a12] shadow-[0_0_18px_rgb(var(--c-primary)/0.5)] touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:cursor-grabbing ${!dragging && x === 0 && !arrived ? "rs-idle" : ""}`}
          style={{ width: KNOB, height: KNOB, transform: x ? `translateX(${x}px)` : undefined }}
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 rotate-45" style={{ transform: `rotate(${45 - progress * 45}deg) scale(${1 + progress * 0.15})`, transition: dragging ? "none" : "transform .38s" }}>
            <path d={PLANE} fill="currentColor" />
          </svg>
        </button>
      </div>

      <p aria-hidden className="rs-hint pl-1 text-[0.6875rem] short:pl-0 font-semibold uppercase tracking-[0.28em] text-white/55">
        {hint} <span className="text-primary">›››</span>
      </p>
    </div>
  );
}
