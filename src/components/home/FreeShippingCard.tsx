import { PERU_MAP, projectPeru } from "@/lib/geo/peru";
import { SHIPPING_ORIGIN } from "@/lib/config/shipments";
import { siteConfig } from "@/lib/config/site";

/** Destinations drawn from Arequipa to say "all of Peru" (illustrative, not a list of shipments). */
const REACH: ReadonlyArray<readonly [number, number]> = [
  [-77.0428, -12.0464], // Lima
  [-79.8407, -6.7714], // Chiclayo
  [-79.0299, -8.1091], // Trujillo
  [-73.2538, -3.7491], // Iquitos
  [-71.9675, -13.5319], // Cusco
  [-75.2186, -12.0653], // Huancayo
];

/**
 * Hero "free shipping" card: a small outline of Peru with routes fanning out of
 * Arequipa, next to the promise in two lines. Static SVG; the destination
 * dots pulse unless the visitor prefers reduced motion.
 */
export function FreeShippingCard({ className }: { className?: string }) {
  const [ox, oy] = projectPeru(SHIPPING_ORIGIN.coords);
  const { title, sub } = siteConfig.home.hero.freeShipping;

  return (
    <div
      className={`flex items-center gap-3.5 rounded-2xl bg-[#06100c] py-2 pl-3 pr-5 ${className ?? ""}`}
    >
      <svg viewBox="0 0 940 1160" aria-hidden className="h-[5rem] w-auto shrink-0 short:h-[4rem]">
        <style>{`
          .fs-dot{transform-box:fill-box;transform-origin:center;animation:fsPulse 2.6s ease-out infinite}
          @keyframes fsPulse{0%{transform:scale(.6);opacity:.9}100%{transform:scale(3);opacity:0}}
          @media (prefers-reduced-motion: reduce){.fs-dot{animation:none;opacity:0}}
        `}</style>
        <path d={PERU_MAP.d} fill="rgb(18 180 128 / 0.26)" stroke="#2fe0a6" strokeWidth={12} strokeLinejoin="round" />
        {REACH.map(([lon, lat], i) => {
          const [x, y] = projectPeru([lon, lat]);
          const mx = (ox + x) / 2, my = (oy + y) / 2;
          let nx = -(y - oy), ny = x - ox;
          const len = Math.hypot(nx, ny) || 1;
          nx /= len; ny /= len;
          if (nx < 0) { nx = -nx; ny = -ny; }
          const d = `M ${ox} ${oy} Q ${mx + nx * Math.min(150, len * 0.2)} ${my + ny * Math.min(150, len * 0.2)} ${x} ${y}`;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="#7ff0c6" strokeWidth={9} strokeLinecap="round" strokeDasharray="2 20" opacity={0.85} />
              <circle className="fs-dot" cx={x} cy={y} r={22} fill="none" stroke="#12B480" strokeWidth={8} style={{ animationDelay: `${i * 0.35}s` }} />
              <circle cx={x} cy={y} r={24} fill="#12B480" />
            </g>
          );
        })}
        <circle cx={ox} cy={oy} r={34} fill="#fff" stroke="#06100c" strokeWidth={10} />
      </svg>

      <div className="leading-none">
        <p className="font-display text-[1.65rem] font-extrabold uppercase tracking-[0.06em] text-primary drop-shadow-[0_0_18px_rgb(var(--c-primary)/0.45)] short:text-2xl">
          {title}
        </p>
        <p className="mt-1.5 text-[0.95rem] font-bold text-white/90">{sub}</p>
      </div>
    </div>
  );
}
