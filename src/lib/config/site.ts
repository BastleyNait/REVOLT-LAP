/**
 * Global, content-level configuration. Anything a store owner might want to
 * tweak (brand, nav, copy, SEO, WhatsApp, business data) lives here instead of
 * being scattered across components. Everything the visitor reads is in
 * Spanish (Perú): REVOLT is an online-only store based in Arequipa that ships
 * nationwide.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialItem {
  label: string;
  /** Leave empty to hide the link (no dead "#" links in the footer). */
  href: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Canonical base URL used for metadata, sitemap, JSON-LD and WhatsApp links.
 * Set `NEXT_PUBLIC_SITE_URL` to the custom domain (e.g. https://revolt.pe).
 * On Vercel it falls back to the production domain automatically.
 */
function resolveBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  const isLocal = !explicit || /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(explicit);
  // On Vercel a localhost value (copied from .env) must never leak into
  // WhatsApp links, canonical tags or the sitemap.
  if (explicit && !(isLocal && process.env.VERCEL)) return explicit;
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;
  return explicit ?? "http://localhost:3000";
}

const whatsappPhone = (process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "51987545926").replace(/\D/g, "");

export const siteConfig = {
  name: "REVOLT",
  legalName: "REVOLT Laptops",
  tagline: "Laptops reacondicionadas en Arequipa",
  /** Default <title> for the home page (keep it under ~60 characters). */
  title: "Laptops reacondicionadas en Arequipa | REVOLT",
  /** Default meta description (keep it around 150–160 characters). */
  description:
    "Laptops reacondicionadas y seminuevas en Arequipa, revisadas por técnicos y con todo funcional. Precios en soles, pago en dólares y envíos a todo el Perú.",
  keywords: [
    "laptops reacondicionadas",
    "laptops reacondicionadas Arequipa",
    "laptops baratas Arequipa",
    "laptops baratas Perú",
    "laptops seminuevas",
    "laptops de segunda Arequipa",
    "laptops usadas Arequipa",
    "laptops Lenovo ThinkPad",
    "laptops Dell Latitude",
    "laptops HP EliteBook",
    "comprar laptop online Perú",
  ],
  url: resolveBaseUrl(),
  locale: "es-PE",
  /** OpenGraph locale uses an underscore. */
  ogLocale: "es_PE",
  currency: "PEN",
  /**
   * Prices are quoted in soles (PEN). Buyers may also pay in USD; this is the
   * reference rate (1 USD = X PEN) used to show the dollar equivalent.
   */
  usdRate: Number(process.env.NEXT_PUBLIC_USD_RATE ?? 3.7),
  /** Online-only store: no street address or opening hours on purpose. */
  business: {
    city: "Arequipa",
    region: "Arequipa",
    country: "PE",
    countryName: "Perú",
  },
  whatsapp: {
    /** E.164 number without the leading "+" (digits only), e.g. 51987545926. */
    phone: whatsappPhone,
    display: whatsappPhone.startsWith("51")
      ? `+51 ${whatsappPhone.slice(2).replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3")}`
      : `+${whatsappPhone}`,
    defaultMessage: "Hola REVOLT, me interesa este equipo:",
    generalMessage: "Hola REVOLT, quiero información sobre sus laptops reacondicionadas.",
  },
  nav: [
    { label: "Laptops", href: "/#laptops" },
    { label: "Cómo comprar", href: "/#como-comprar" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Preguntas", href: "/#preguntas" },
  ] satisfies NavItem[],
  socials: [
    { label: "Facebook", href: "" },
    { label: "Instagram", href: "" },
    { label: "TikTok", href: "" },
  ] satisfies SocialItem[],
  /** The core promise, repeated on the home, product and "Nosotros" pages. */
  promise: {
    title: "Reacondicionadas profesionalmente, con todo funcional",
    body: "Cada laptop pasa por diagnóstico, limpieza y pruebas antes de publicarse. Todo funciona correctamente, a menos que se especifique lo contrario en la descripción del equipo.",
  },
  /** Short trust points shown in the hero bar and the footer. */
  trust: ["Revisadas por técnicos", "Todo funcional", "Envíos a todo el Perú", "Paga en soles o dólares"],
  /** Storefront marketing copy (kept out of components for easy editing). */
  home: {
    hero: {
      /** Rendered as the page <h1> in the original tracked-caps style. */
      title: "Laptops reacondicionadas en Arequipa",
      pitch:
        "Rendimiento real a precios insuperables. Cada equipo testeado, certificado y listo para trabajar, crear y jugar.",
      ctaLabel: "Ver inventario",
      flash: "Envío gratis · Equipos en stock y a pedido",
      stats: [
        { icon: "package", label: "Stock disponible" },
        { icon: "truck", label: "Envío rápido" },
        { icon: "check", label: "Todo funcional" },
        { icon: "wallet", label: "Precio insuperable" },
      ],
    },
    inventory: {
      title: "Laptops disponibles",
      subtitle: "Precios en soles. También puedes pagar el equivalente en dólares.",
      empty: "Sin stock por ahora. Vuelve pronto: el inventario rota rápido.",
    },
    steps: [
      {
        title: "Elige tu laptop",
        body: "Mira las fotos reales, las especificaciones y el estado de cada equipo.",
      },
      {
        title: "Escríbenos por WhatsApp",
        body: "Resolvemos tus dudas, te mandamos más fotos o un video y coordinamos el pago.",
      },
      {
        title: "Te la enviamos",
        body: "Despachamos a Arequipa y a cualquier ciudad del Perú, lista para usar.",
      },
    ],
    faq: [
      {
        question: "¿Qué es una laptop reacondicionada?",
        answer:
          "Es un equipo de segunda mano, generalmente de uso empresarial, que fue revisado, limpiado y probado por técnicos para dejarlo en óptimas condiciones. Rinde como una laptop nueva de su gama, pero cuesta bastante menos.",
      },
      {
        question: "¿Las laptops funcionan al 100 %?",
        answer:
          "Sí. Todas se entregan con todo funcional, a menos que se especifique lo contrario en la descripción del equipo. Si un detalle no está perfecto, lo indicamos claramente antes de la compra.",
      },
      {
        question: "¿Tienen tienda física?",
        answer:
          "No, somos una tienda 100 % online con base en Arequipa. Te atendemos por WhatsApp: si quieres, te enviamos más fotos o un video del equipo antes de comprar.",
      },
      {
        question: "¿Hacen envíos fuera de Arequipa?",
        answer: "Sí, enviamos a todo el Perú. Coordinamos el envío contigo por WhatsApp.",
      },
      {
        question: "¿Puedo pagar en dólares?",
        answer:
          "Sí. Los precios están en soles y en cada laptop mostramos el equivalente en dólares. El medio de pago lo coordinamos por WhatsApp.",
      },
      {
        question: "¿Qué significa «Excelente estado» o «Buen estado»?",
        answer:
          "Describe el aspecto físico. «Excelente estado» tiene marcas de uso mínimas o nulas; «Buen estado» puede tener marcas leves en la carcasa que no afectan el funcionamiento.",
      },
    ] satisfies FaqItem[],
    finalCta: {
      title: "¿No sabes cuál elegir?",
      body: "Cuéntanos para qué la necesitas —estudios, oficina, programación o diseño— y te recomendamos la mejor opción para tu presupuesto.",
      label: "Pedir recomendación",
    },
  },
  about: {
    title: "Sobre nosotros",
    metaTitle: "Sobre nosotros: laptops reacondicionadas profesionalmente en Arequipa",
    metaDescription:
      "REVOLT es una tienda online de Arequipa que reacondiciona laptops empresariales con diagnóstico, limpieza y pruebas. Todo funcional y envíos a todo el Perú.",
    intro:
      "REVOLT es una tienda online nacida en Arequipa con una idea simple: que comprar una buena laptop no tenga que costar una fortuna. Elegimos equipos empresariales de marcas como Lenovo, Dell y HP —hechos para durar años— y los reacondicionamos para que rindan como el primer día.",
    process: [
      {
        title: "Selección",
        body: "Elegimos modelos empresariales con buen rendimiento, construcción resistente y repuestos disponibles.",
      },
      {
        title: "Diagnóstico",
        body: "Revisamos procesador, memoria, almacenamiento, batería, pantalla, teclado, puertos, cámara, audio y conectividad.",
      },
      {
        title: "Limpieza y mantenimiento",
        body: "Limpieza interna y externa, y mantenimiento del sistema de ventilación para un funcionamiento fresco y silencioso.",
      },
      {
        title: "Pruebas finales",
        body: "Ponemos el equipo a trabajar y verificamos que todo funcione antes de publicarlo con fotos reales.",
      },
    ],
    reasons: [
      {
        title: "Pagas menos",
        body: "Una laptop empresarial reacondicionada cuesta mucho menos que una nueva de prestaciones similares.",
      },
      {
        title: "Calidad empresarial",
        body: "ThinkPad, Latitude y EliteBook están hechas para jornadas largas: mejores teclados, chasis más resistentes y más puertos.",
      },
      {
        title: "Sin sorpresas",
        body: "Fotos reales, especificaciones claras y el estado de cada equipo indicado en su ficha.",
      },
      {
        title: "Menos residuos",
        body: "Darle una segunda vida a una laptop es la forma más sostenible de comprar tecnología.",
      },
    ],
  },
  product: {
    ctaLabel: "Pedir por WhatsApp",
    trustBadges: [
      { icon: "wrench", label: "Reacondicionada por técnicos" },
      { icon: "check", label: "Todo funcional, salvo que se indique" },
      { icon: "truck", label: "Envíos a todo el Perú" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
