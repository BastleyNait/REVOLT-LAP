import { LOGO_MARK } from "@/lib/envios/logo";
import { CIRCUIT_NODES, CIRCUIT_RINGS, CIRCUIT_TRACES } from "./hero-circuit";

/**
 * Hero background: the REVOLT bolt, big and soft, behind the featured
 * carousel, with circuit traces running out of it. Pure static SVG (gradients
 * only, no blur filter or animation), so it costs nothing on modest devices
 * and replaces the 550 KB photo that used to load here. A left-to-right fade
 * keeps the text column clean.
 */
export function HeroBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#010201]">
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMaxYMid slice"
        className="absolute inset-0 h-full w-full max-lg:opacity-45"
        style={{ maskImage: "linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 0.35) 32%, #000 62%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 0.35) 32%, #000 62%)" }}
      >
        <defs>
          <radialGradient id="hb-glow" cx="79%" cy="46%" r="52%">
            <stop offset="0" stopColor="#0d4a37" />
            <stop offset="0.5" stopColor="#04180f" />
            <stop offset="1" stopColor="#010201" />
          </radialGradient>
          <linearGradient id="hb-bolt" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#0f8f68" stopOpacity="0.06" />
            <stop offset="1" stopColor="#1fd197" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#hb-glow)" />

        {/* circuit traces, three weights */}
        <g fill="none" stroke="#12B480" strokeWidth={2} strokeLinejoin="round">
          <path d={CIRCUIT_TRACES[0]} opacity={0.12} />
          <path d={CIRCUIT_TRACES[1]} opacity={0.2} />
          <path d={CIRCUIT_TRACES[2]} opacity={0.32} />
        </g>
        <path d={CIRCUIT_NODES} fill="#12B480" opacity={0.6} />
        <path d={CIRCUIT_RINGS} fill="none" stroke="#12B480" strokeWidth={1.5} opacity={0.22} />

        {/* the bolt: wide soft halo + the shape itself */}
        <g transform="translate(990,-60) scale(0.43)" opacity={0.38}>
          <path d={LOGO_MARK.d} fill="none" stroke="#12B480" strokeWidth={90} strokeOpacity={0.05} strokeLinejoin="round" />
          <path d={LOGO_MARK.d} fill="none" stroke="#12B480" strokeWidth={46} strokeOpacity={0.07} strokeLinejoin="round" />
          <path d={LOGO_MARK.d} fill="url(#hb-bolt)" stroke="#2fe0a6" strokeWidth={5} strokeOpacity={0.35} strokeLinejoin="round" />
        </g>
      </svg>
      {/* extra left-side darkening so the text always reads */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,2,1,0.82)_0%,rgba(1,2,1,0.45)_42%,transparent_72%)]" />
    </div>
  );
}
