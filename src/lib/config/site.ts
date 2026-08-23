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
  locale: "es-PE",
  currency: "PEN",
  /**
   * Prices are quoted in soles (PEN). Buyers may also pay in USD; this is the
   * reference rate (1 USD = X PEN) used to show the dollar equivalent.
   */
  usdRate: Number(process.env.NEXT_PUBLIC_USD_RATE ?? 3.7),
  whatsapp: {
    /** E.164 number without the leading "+", e.g. 5215512345678. Empty => generic share link. */
    phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "",
    defaultMessage: "Hola REVOLT, me interesa este equipo:",
  },
  nav: [
    { label: "Inventario", href: "/#inventario" },
    { label: "Especificaciones", href: "/#inventario" },
    { label: "Ofertas", href: "/#inventario", highlight: true },
    { label: "Sobre nosotros", href: "/#about" },
  ] satisfies NavItem[],
  socials: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Twitter", href: "#" },
  ] satisfies SocialItem[],
  /** Storefront marketing copy (kept out of components for easy editing). */
  home: {
    hero: {
      eyebrow: "Certificados · Testeados · Stock limitado",
      titleLines: ["LAPTOPS", "REACONDICIONADAS"],
      pitch:
        "Rendimiento real a precios insuperables. Cada equipo testeado, certificado y listo para trabajar, crear y jugar.",
      ctaLabel: "Ver inventario",
      badge: "Desde S/ 1,410",
      flash: "Envío gratis · Equipos en stock y a pedido",
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
