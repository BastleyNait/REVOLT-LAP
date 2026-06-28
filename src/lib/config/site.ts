/**
 * Global, content-level configuration. Anything a store owner might want to
 * tweak (brand, nav, socials, locale, WhatsApp) lives here instead of being
 * scattered across components.
 */

export interface NavItem {
  label: string;
  href: string;
  /** Renders with the orange "deal" treatment in the navbar. */
  highlight?: boolean;
}

export interface SocialItem {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "REVOLT",
  legalName: "REVOLT.",
  tagline: "Uncompromising Performance",
  description:
    "High-performance refurbished laptops without the corporate markup. Tested, graded and ready to work, game and create.",
  /** Used for absolute URLs (OpenGraph, WhatsApp deep links). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-US",
  currency: "USD",
  whatsapp: {
    /** E.164 number without the leading "+", e.g. 5215512345678. Empty => generic share link. */
    phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "",
    defaultMessage: "Hola REVOLT 👋, me interesa este equipo:",
  },
  nav: [
    { label: "Inventory", href: "/#inventario" },
    { label: "Specs", href: "/#inventario" },
    { label: "Deals", href: "/#inventario", highlight: true },
    { label: "About", href: "/#about" },
  ] satisfies NavItem[],
  socials: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Twitter", href: "#" },
  ] satisfies SocialItem[],
  /** Storefront marketing copy (kept out of components for easy editing). */
  home: {
    hero: {
      eyebrow: "Hola, somos REVOLT.",
      titleLines: ["LAPTOPS", "BRUTALES"],
      pitch:
        "Rendimiento sin compromisos. Equipos reacondicionados, listos para trabajar a un precio insuperable. Stock limitado.",
      ctaLabel: "Ver inventario",
      badge: "Reacondicionado",
      flash: "",
    },
    inventoryHeading: "INVENTARIO",
    inventoryEmpty: "Sin stock por ahora. Vuelve pronto — el inventario rota rápido.",
  },
  product: {
    ctaLabel: "PEDIR POR WHATSAPP",
    trustBadges: [
      { icon: "verified", label: "6 MONTH WARRANTY" },
      { icon: "local_shipping", label: "FREE SHIPPING" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
