import type { Config } from "tailwindcss";

/**
 * REVOLT design tokens — Neobrutalism, "Electric Pop" palette
 * (Electric Violet · Hot Pink · Acid Lime).
 *
 * Colors are NOT hardcoded here anymore: every token resolves to a CSS custom
 * property holding space-separated RGB channels (e.g. `--c-primary: 109 40 217`),
 * wrapped in `rgb(... / <alpha-value>)` so Tailwind alpha modifiers (e.g.
 * `bg-surface/90`) keep working. The light and dark values live in
 * `globals.css` under `:root` and `.dark`. This stays the single source of
 * truth for the visual language; components reference semantic tokens only.
 */
const c = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        background: c("background"),
        surface: c("surface"),
        "surface-bright": c("surface-bright"),
        "surface-dim": c("surface-dim"),
        "surface-container-lowest": c("surface-container-lowest"),
        "surface-container-low": c("surface-container-low"),
        "surface-container": c("surface-container"),
        "surface-container-high": c("surface-container-high"),
        "surface-container-highest": c("surface-container-highest"),
        "surface-variant": c("surface-variant"),
        "on-surface": c("on-surface"),
        "on-surface-variant": c("on-surface-variant"),
        "on-background": c("on-background"),
        // Constant dark ink for text sitting on the bright color blocks —
        // stays dark in both themes (the containers stay vivid in dark mode).
        "on-container": c("on-container"),
        "inverse-surface": c("inverse-surface"),
        "inverse-on-surface": c("inverse-on-surface"),
        outline: c("outline"),
        "outline-variant": c("outline-variant"),
        // Primary — Electric Violet
        primary: c("primary"),
        "on-primary": c("on-primary"),
        "primary-container": c("primary-container"),
        "on-primary-container": c("on-primary-container"),
        "primary-fixed": c("primary-fixed"),
        "primary-fixed-dim": c("primary-fixed-dim"),
        "on-primary-fixed": c("on-primary-fixed"),
        "on-primary-fixed-variant": c("on-primary-fixed-variant"),
        "inverse-primary": c("inverse-primary"),
        "surface-tint": c("surface-tint"),
        // Secondary — Hot Pink
        secondary: c("secondary"),
        "on-secondary": c("on-secondary"),
        "secondary-container": c("secondary-container"),
        "on-secondary-container": c("on-secondary-container"),
        "secondary-fixed": c("secondary-fixed"),
        "secondary-fixed-dim": c("secondary-fixed-dim"),
        "on-secondary-fixed": c("on-secondary-fixed"),
        "on-secondary-fixed-variant": c("on-secondary-fixed-variant"),
        // Tertiary — Acid Lime
        tertiary: c("tertiary"),
        "on-tertiary": c("on-tertiary"),
        "tertiary-container": c("tertiary-container"),
        "on-tertiary-container": c("on-tertiary-container"),
        "tertiary-fixed": c("tertiary-fixed"),
        "tertiary-fixed-dim": c("tertiary-fixed-dim"),
        "on-tertiary-fixed": c("on-tertiary-fixed"),
        "on-tertiary-fixed-variant": c("on-tertiary-fixed-variant"),
        // Accent — Acid Yellow
        accent: c("accent"),
        "on-accent": c("on-accent"),
        "accent-dim": c("accent-dim"),
        // Error
        error: c("error"),
        "on-error": c("on-error"),
        "error-container": c("error-container"),
        "on-error-container": c("on-error-container"),
      },
      fontFamily: {
        "display-xl": ["var(--font-display)", "sans-serif"],
        "display-lg": ["var(--font-display)", "sans-serif"],
        "headline-lg": ["var(--font-display)", "sans-serif"],
        "headline-lg-mobile": ["var(--font-display)", "sans-serif"],
        "body-lg": ["var(--font-body)", "sans-serif"],
        "body-md": ["var(--font-body)", "sans-serif"],
        "label-mono": ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["120px", { lineHeight: "110px", letterSpacing: "-0.04em", fontWeight: "900" }],
        "display-lg": ["80px", { lineHeight: "80px", letterSpacing: "-0.02em", fontWeight: "900" }],
        "headline-lg": ["48px", { lineHeight: "52px", letterSpacing: "-0.01em", fontWeight: "800" }],
        "headline-lg-mobile": ["32px", { lineHeight: "36px", fontWeight: "800" }],
        "body-lg": ["20px", { lineHeight: "28px", fontWeight: "500" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-mono": ["14px", { lineHeight: "16px", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      spacing: {
        unit: "4px",
        gutter: "24px",
        "margin-edge": "32px",
        "shadow-offset": "8px",
      },
      borderWidth: {
        // Glassmorphism = hairline borders; the old brutalist names now map to
        // thin strokes so existing markup softens automatically.
        DEFAULT: "1px",
        thin: "1px",
        thick: "1px",
        heavy: "1.5px",
      },
      borderRadius: {
        // Soft, rounded corners across the board.
        DEFAULT: "1rem",
        none: "0px",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      boxShadow: {
        // Soft, diffuse shadows tinted with the themeable --c-shadow ink. The
        // old `neo-*` names now produce gentle elevation instead of hard offsets.
        "neo-xs": "0 1px 2px 0 rgb(var(--c-shadow) / 0.10)",
        "neo-sm": "0 2px 10px -2px rgb(var(--c-shadow) / 0.14)",
        neo: "0 10px 30px -6px rgb(var(--c-shadow) / 0.18)",
        "neo-md": "0 16px 40px -8px rgb(var(--c-shadow) / 0.20)",
        "neo-lg": "0 24px 56px -12px rgb(var(--c-shadow) / 0.26)",
        "neo-xl": "0 32px 72px -16px rgb(var(--c-shadow) / 0.32)",
        glass: "0 8px 32px -4px rgb(var(--c-shadow) / 0.22), inset 0 1px 0 0 rgb(255 255 255 / 0.18)",
        none: "0 0 0 0 rgba(0,0,0,0)",
      },
    },
  },
  plugins: [],
};

export default config;
