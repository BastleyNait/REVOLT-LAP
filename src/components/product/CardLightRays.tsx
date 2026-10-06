/**
 * Curved light ribbons for the product cards: sweeping arcs of brand green on
 * a black card (a soft blurred glow layer + a thin bright core layer). Pure
 * SVG, no JS. `uid` keeps gradient ids unique per card.
 */
export function CardLightRays({ uid }: { uid: string }) {
  const core = `ray-core-${uid}`;
  const soft = `ray-soft-${uid}`;

  const ribbons = [
    // Long sweep across the lower half, rising to the right.
    "M -40 520 C 90 470, 230 420, 460 300",
    // Second arc just below it, tighter curve.
    "M -40 590 C 120 560, 260 500, 460 380",
    // Bottom-right swoosh.
    "M 140 660 C 260 640, 360 590, 460 520",
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {/* Soft glow */}
      <svg className="absolute inset-0 h-full w-full blur-2xl" viewBox="0 0 400 640" preserveAspectRatio="none">
        <defs>
          <linearGradient id={soft} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgb(18 180 128)" stopOpacity="0" />
            <stop offset="0.55" stopColor="rgb(18 180 128)" stopOpacity="0.32" />
            <stop offset="1" stopColor="rgb(18 180 128)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {ribbons.map((d) => (
          <path key={d} d={d} fill="none" stroke={`url(#${soft})`} strokeWidth="46" strokeLinecap="round" />
        ))}
        {/* Left-edge glow, as in the reference */}
        <path d="M -30 250 C 40 330, 50 430, 10 560" fill="none" stroke="rgb(18 180 128)" strokeOpacity="0.16" strokeWidth="60" />
      </svg>

      {/* Thin bright cores */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 640" preserveAspectRatio="none">
        <defs>
          <linearGradient id={core} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgb(160 255 220)" stopOpacity="0" />
            <stop offset="0.6" stopColor="rgb(160 255 220)" stopOpacity="0.7" />
            <stop offset="1" stopColor="rgb(160 255 220)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {ribbons.map((d, index) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={`url(#${core})`}
            strokeWidth={index === 0 ? 1.4 : 1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
