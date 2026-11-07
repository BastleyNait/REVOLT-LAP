/**
 * Global, content-level configuration. Anything a store owner might want to
 * tweak (brand, nav, copy, SEO, WhatsApp, business data) lives here instead of
 * being scattered across components. Everything the visitor reads is in
 * Spanish (Perú): REVOLT is an online-only store that sells to all of Peru
 * (nationwide shipping; in-person delivery in Arequipa, where it is based).
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

export interface ProofItem {
  /** Big number/word, e.g. "6". */
  value: string;
  /** Short caption next to it, e.g. "meses de garantía". */
  label: string;
}

export interface DeliveryPhoto {
  /** Path under /public, e.g. "/entregas/arequipa-01.jpg". */
  src: string;
  /** What the photo shows, e.g. "Entrega en persona en Arequipa — ThinkPad T480". */
  alt: string;
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

/** Adelanto para separar una laptop (soles). Cámbialo acá y se actualiza en toda la página. */
const DEPOSIT_PEN = 50;
/** Meses de garantía. Cámbialo acá y se actualiza en toda la página. */
const WARRANTY_MONTHS = 6;
/** RUC del negocio (persona natural con negocio). Se puede cambiar con NEXT_PUBLIC_RUC. */
const RUC = process.env.NEXT_PUBLIC_RUC || "10710027078";
/** Horas que tiene el cliente para pagar el saldo desde que recibe la foto de la guía. */
const BALANCE_HOURS = 24;

export const siteConfig = {
  name: "REVOLT",
  legalName: "REVOLT Laptops",
  tagline: "Laptops reacondicionadas en Perú",
  /** Default <title> for the home page (keep it under ~60 characters). */
  title: "Laptops Reacondicionadas y Baratas en Perú | REVOLT",
  /** Default meta description (keep it around 150–160 characters). */
  description:
    "Laptops reacondicionadas, baratas y seminuevas en Perú: Lenovo ThinkPad, Dell y HP con todo funcional. Envíos a todo el Perú y entrega en persona en Arequipa.",
  keywords: [
    "laptops reacondicionadas",
    "laptops reacondicionadas Perú",
    "laptops baratas Perú",
    "laptops económicas Perú",
    "laptops seminuevas Perú",
    "laptops de segunda Perú",
    "laptops usadas Perú",
    "laptops baratas Lima",
    "laptops Arequipa",
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
    /**
     * RUC del negocio (persona natural con negocio, RUC 10). Déjalo vacío para
     * ocultarlo. Cuando lo pongas aparece en el pie de página, en "Cómo comprar",
     * en la ficha y en los datos para Google: es lo primero que preguntan los
     * clientes que desconfían.
     */
    ruc: RUC,
    /**
     * Nombre del titular de las cuentas (Yape / BCP). Si lo pones, la página
     * avisa que solo se paga a ese nombre: así el cliente sabe que el depósito
     * es legítimo y no cae en imitadores. Vacío = no se muestra.
     */
    accountHolder: process.env.NEXT_PUBLIC_ACCOUNT_HOLDER || "Sebastian Chirinos",
    /**
     * Enlace a la ficha de Google Business (Maps → Compartir → copiar enlace).
     * Con valor aparece "Ver reseñas en Google" en "Cómo comprar" y el pie, y
     * Google enlaza la web con la ficha (sameAs). Vacío = no se muestra.
     */
    googleBusinessUrl: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || "",
  },
  /** Garantía, comprobante y envío: se repiten en el hero, la ficha, el FAQ y los datos para Google. */
  warranty: {
    months: WARRANTY_MONTHS,
  },
  shipping: {
    carrier: "Shalom",
    /** Días hábiles estimados de Arequipa a Lima (y la mayoría de ciudades). */
    transitDays: { min: 2, max: 3 },
    /** true = el envío no le cuesta al cliente (lo dice el hero: "Envío gratis"). */
    free: true,
  },
  /**
   * Compra segura: el flujo de pago que ya explican por WhatsApp, ahora en la
   * página. `depositPen` es el adelanto para separar la laptop.
   */
  payment: {
    depositPen: DEPOSIT_PEN,
    balanceHours: BALANCE_HOURS,
    methods: "Yape, transferencia o depósito BCP",
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
      title: "Laptops reacondicionadas en Perú",
      pitch:
        "Rendimiento real a precios insuperables. Cada equipo testeado y listo para trabajar, crear y jugar. Entrega en persona en Arequipa y envíos a todo el Perú.",
      ctaLabel: "Ver inventario",
      flash: "Envío gratis · Equipos en stock y a pedido",
      /**
       * Hechos comprobables debajo del texto del hero (garantía, comprobante…).
       * Mejor datos concretos que "100% confiable": quien desconfía no cree en
       * adjetivos, cree en garantías que puede exigir. Máximo 2–3 items.
       */
      proof: [
        { value: String(WARRANTY_MONTHS), label: "meses de garantía" },
        { value: `S/ ${DEPOSIT_PEN}`, label: "para separar, el resto al ver la guía" },
      ] satisfies ProofItem[],
      /** Link under the CTAs that jumps to the safe-purchase steps. */
      safeLink: "¿Cómo pago sin riesgo?",
      featuredLabel: "Destacadas",
      stats: [
        { icon: "package", label: "Stock disponible" },
        { icon: "truck", label: "Envío rápido" },
        { icon: "check", label: "Todo funcional" },
        { icon: "receipt", label: "Boleta electrónica" },
      ],
    },
    inventory: {
      title: "Laptops disponibles",
      subtitle: "Precios en soles. También puedes pagar el equivalente en dólares.",
      empty: "Sin stock por ahora. Vuelve pronto: el inventario rota rápido.",
      filters: {
        label: "Filtrar por disponibilidad",
        all: "Todas",
        "in-stock": "En stock",
        incoming: "En camino",
        "sold-out": "Agotadas",
        emptyFilter: "No hay laptops en este estado por ahora.",
      },
    },
    /** "Cómo comprar": el flujo real de pago, paso a paso (lo que más preguntan por WhatsApp). */
    howToBuy: {
      title: "Cómo comprar sin riesgo",
      subtitle:
        "Somos una tienda 100 % online. Para que no arriesgues tu dinero, solo separas con un adelanto y pagas el resto cuando tu laptop ya está empaquetada y enviada a tu nombre.",
    },
    steps: [
      {
        icon: "chat",
        title: "Elige y escríbenos",
        body: "Por WhatsApp te mandamos más fotos o un video del equipo y resolvemos tus dudas antes de pagar nada.",
      },
      {
        icon: "wallet",
        title: `Separa con S/ ${DEPOSIT_PEN}`,
        body: "Por Yape, transferencia o depósito BCP. No es un pago extra: se descuenta del precio de la laptop.",
      },
      {
        icon: "video",
        title: "Te mostramos el envío",
        body: "Te enviamos foto y video de tu laptop siendo empaquetada y la foto de la guía de Shalom a tu nombre.",
      },
      {
        icon: "key",
        title: "Pagas el saldo y recoges",
        body: `Con la guía en la mano tienes ${BALANCE_HOURS} horas para pagar el saldo, y te damos la clave para retirarla en tu agencia Shalom. En Arequipa también la entregamos en persona.`,
      },
    ],
    /** Short guarantees under the steps. */
    guarantees: [
      { icon: "shield", title: `${WARRANTY_MONTHS} meses de garantía`, body: "Si presenta una falla de funcionamiento, la revisamos y solucionamos." },
      { icon: "receipt", title: "Boleta electrónica", body: `Con RUC ${RUC}, al completar el pago. Verificable en SUNAT.` },
      { icon: "verified", title: "Componentes originales", body: "Equipos corporativos con sus piezas de fábrica, revisados por técnicos." },
      { icon: "truck", title: "Envío con Shalom", body: "A Lima llega en 2 a 3 días hábiles. A todo el Perú." },
    ],
    /**
     * Fotos de entregas reales (las que mandas por WhatsApp como "una de las
     * ventas que realicé"). Ponlas en /public/entregas/ y agrégalas acá: la
     * sección "Entregas reales" aparece sola cuando hay al menos una.
     * Pide permiso al cliente o no muestres su cara.
     */
    deliveries: [] as DeliveryPhoto[],
    faq: [
      {
        question: "¿Es seguro comprarles si no tienen tienda física?",
        answer:
          `Sí. Solo adelantas S/ ${DEPOSIT_PEN} para separar la laptop. Luego te enviamos foto y video del equipo siendo empaquetado y la guía de Shalom a tu nombre, y recién ahí pagas el saldo. En Arequipa también te la entregamos en persona. Emitimos boleta electrónica y la laptop tiene ${WARRANTY_MONTHS} meses de garantía.`,
      },
      {
        question: "¿Qué pasa con mi adelanto si al final no compro?",
        answer: `Si te arrepientes antes de que enviemos la laptop, te devolvemos el adelanto completo. Una vez enviada, tienes ${BALANCE_HOURS} horas desde que te mandamos la guía para pagar el saldo; si no se concreta, el adelanto se usa para cubrir el envío de ida y el retorno de la laptop a Arequipa.`,
      },
      {
        question: "¿Las laptops tienen garantía?",
        answer:
          `Sí, todas tienen ${WARRANTY_MONTHS} meses de garantía. Cubre fallas de funcionamiento del equipo (placa, pantalla, teclado, puertos, memoria, almacenamiento). No cubre golpes, caídas, líquidos ni daños por mal uso. Si algo falla, nos escribes por WhatsApp y lo revisamos.`,
      },
      {
        question: "¿Emiten boleta o factura?",
        answer:
          `Sí. Trabajamos con RUC ${RUC} y emitimos boleta de venta electrónica una vez que completas el pago. Puedes verificar el RUC en la consulta RUC de SUNAT.`,
      },
      {
        question: "¿Cuánto demora el envío a Lima y provincias?",
        answer:
          "Enviamos por Shalom desde Arequipa. A Lima llega en 2 a 3 días hábiles y a la mayoría de ciudades en un plazo similar. Te pasamos la guía para que sigas tu envío, y recoges la laptop en tu agencia Shalom con una clave.",
      },
      {
        question: "¿Los componentes son originales?",
        answer:
          "Sí. Son laptops de uso corporativo con sus componentes originales de fábrica. Si alguna pieza fue reemplazada o mejorada (por ejemplo, más RAM o un SSD más grande), lo indicamos en la descripción del equipo.",
      },
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
          "No, somos una tienda 100 % online para mantener precios bajos. Estamos en Arequipa: ahí te la entregamos en persona, y al resto del Perú la enviamos por Shalom. Por WhatsApp te enviamos más fotos o un video del equipo antes de comprar.",
      },
      {
        question: "¿Hacen envíos a todo el Perú?",
        answer: "Sí, enviamos a Lima, Cusco, Trujillo, Piura, Tacna y cualquier ciudad del Perú. Si estás en Arequipa, también te la entregamos en persona. Todo se coordina por WhatsApp.",
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
    metaTitle: "Sobre nosotros: laptops reacondicionadas profesionalmente en Perú",
    metaDescription:
      "REVOLT es una tienda online peruana que reacondiciona laptops empresariales con diagnóstico, limpieza y pruebas. Todo funcional y envíos a todo el Perú.",
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
  /**
   * Cupón de reserva de las laptops "en camino". Este es el único lugar donde
   * se cambia el monto: la ficha, las tarjetas, el aviso y el mensaje de
   * WhatsApp lo leen de acá.
   */
  reservation: {
    /** Monto del cupón, en soles. */
    couponPen: 100,
  },
  product: {
    ctaLabel: "Pedir por WhatsApp",
    trustBadges: [
      { icon: "shield", label: `${WARRANTY_MONTHS} meses de garantía` },
      { icon: "receipt", label: "Boleta electrónica" },
      { icon: "check", label: "Todo funcional, salvo que se indique" },
      { icon: "truck", label: "Envío por Shalom a todo el Perú (Lima: 2 a 3 días hábiles)" },
    ],
    /** Under the WhatsApp button: the one line that answers "¿y si pierdo mi plata?". */
    safeNote: `Separas con S/ ${DEPOSIT_PEN} y pagas el saldo cuando veas tu laptop empaquetada y la guía de envío.`,
  },
} as const;

export type SiteConfig = typeof siteConfig;
