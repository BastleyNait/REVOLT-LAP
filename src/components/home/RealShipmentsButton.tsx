import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const PLANE = "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z";

/**
 * "Mira nuestros envíos reales": a boarding-pass style button. A thin gradient
 * rim, a left stub with a plane flying along a dotted route (Arequipa → …) and
 * a live dot. The plane only moves on hover/focus, and not at all with reduced
 * motion. Solid dark body: it never blends into the photo behind the hero.
 */
export function RealShipmentsButton({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex rounded-full bg-[linear-gradient(110deg,rgb(18_180_128/0.9),rgb(255_255_255/0.35)_45%,rgb(18_180_128/0.5))] p-px transition-[box-shadow,transform] duration-200 ease-out-strong hover:shadow-[0_0_26px_rgb(var(--c-primary)/0.35)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className ?? ""}`}
    >
      <style>{`
        .rs-plane{transition:transform .9s cubic-bezier(.22,1,.36,1)}
        .group:hover .rs-plane,.group:focus-visible .rs-plane{transform:translateX(34px)}
        .rs-live{animation:rsLive 1.8s ease-out infinite}
        @keyframes rsLive{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
        @media (prefers-reduced-motion: reduce){.rs-plane{transition:none}.rs-live{animation:none;opacity:0}}
      `}</style>
      <span className="flex min-h-11 items-center gap-3 rounded-full bg-[#080d0b] py-1 pl-1.5 pr-5 text-[0.9375rem] font-bold text-white">
        {/* boarding-pass stub */}
        <span className="relative flex h-9 w-[5.4rem] shrink-0 items-center overflow-hidden rounded-full bg-primary/15 pl-2.5">
          <span className="relative z-[1] h-2 w-2 shrink-0 rounded-full bg-white" />
          <span aria-hidden className="absolute left-4 right-3 top-1/2 border-t-2 border-dotted border-primary/70" />
          <svg viewBox="0 0 24 24" aria-hidden className="rs-plane absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 text-white">
            <path d={PLANE} fill="currentColor" />
          </svg>
          <span className="relative z-[1] ml-auto mr-2.5 flex h-2 w-2 shrink-0">
            <span className="rs-live absolute inset-0 rounded-full bg-primary" />
            <span className="relative h-2 w-2 rounded-full bg-primary" />
          </span>
        </span>
        {label}
        <Icon name="arrow" className="text-lg text-primary transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
