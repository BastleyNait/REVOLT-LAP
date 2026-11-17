import { PERU_MAP, projectPeru } from "@/lib/geo/peru";
import { SHIPPING_ORIGIN, type RealShipment } from "@/lib/config/shipments";

/**
 * Peru with an arc from Arequipa to every city we have shipped to. Static SVG
 * (server-rendered); the only motion is a CSS pulse on the destinations, off
 * when the visitor prefers reduced motion.
 */
export function ShipmentsMap({ shipments, className }: { shipments: RealShipment[]; className?: string }) {
  const [ox, oy] = projectPeru(SHIPPING_ORIGIN.coords);
  // One marker per city, even with several shipments to it.
  const cities = new Map<string, RealShipment>();
  for (const s of shipments) if (!cities.has(s.city)) cities.set(s.city, s);

  return (
    <svg
      viewBox={`-40 -10 ${PERU_MAP.width + 120} ${PERU_MAP.height + 20}`}
      className={className}
      role="img"
      aria-label={`Mapa del Perú con envíos desde ${SHIPPING_ORIGIN.city} a ${[...cities.keys()].join(", ")}`}
    >
      <style>{`
        .ship-pulse{transform-box:fill-box;transform-origin:center;animation:shipPulse 2.4s ease-out infinite}
        @keyframes shipPulse{0%{transform:scale(.4);opacity:.9}100%{transform:scale(2.6);opacity:0}}
        @media (prefers-reduced-motion: reduce){.ship-pulse{animation:none;opacity:0}}
      `}</style>
      <path d={PERU_MAP.d} fill="rgb(18 180 128 / 0.08)" stroke="#12B480" strokeWidth={3} strokeLinejoin="round" />

      {[...cities.values()].map((s) => {
        const [x, y] = projectPeru(s.coords);
        // Arc bulging towards the inland side, proportional to the distance.
        const mx = (ox + x) / 2, my = (oy + y) / 2;
        let nx = -(y - oy), ny = x - ox;
        const len = Math.hypot(nx, ny) || 1;
        nx /= len; ny /= len;
        if (nx < 0) { nx = -nx; ny = -ny; }
        const bend = Math.min(160, len * 0.22);
        const d = `M ${ox} ${oy} Q ${mx + nx * bend} ${my + ny * bend} ${x} ${y}`;
        return <path key={`arc-${s.city}`} d={d} fill="none" stroke="#12B480" strokeWidth={6} strokeLinecap="round" strokeDasharray="2 14" opacity={0.9} />;
      })}

      {[...cities.values()].map((s) => {
        const [x, y] = projectPeru(s.coords);
        const left = s.labelSide === "left";
        return (
          <g key={`city-${s.city}`}>
            <circle className="ship-pulse" cx={x} cy={y} r={16} fill="none" stroke="#12B480" strokeWidth={4} />
            <circle cx={x} cy={y} r={15} fill="#12B480" stroke="#010201" strokeWidth={4} />
            <text
              x={left ? x - 28 : x + 28}
              y={y + 13}
              textAnchor={left ? "end" : "start"}
              fill="#12B480"
              style={{ font: "700 40px var(--font-body), sans-serif" }}
            >
              {s.city}
            </text>
          </g>
        );
      })}

      {/* Origin */}
      <circle cx={ox} cy={oy} r={17} fill="#ffffff" stroke="#010201" strokeWidth={4} />
      <text x={ox - 28} y={oy - 6} textAnchor="end" fill="#ffffff" style={{ font: "700 40px var(--font-body), sans-serif" }}>
        {SHIPPING_ORIGIN.city}
      </text>
      <text
        x={ox - 28}
        y={oy + 30}
        textAnchor="end"
        fill="rgb(255 255 255 / 0.6)"
        style={{ font: "600 24px var(--font-body), sans-serif", letterSpacing: "4px" }}
      >
        ORIGEN
      </text>
    </svg>
  );
}
