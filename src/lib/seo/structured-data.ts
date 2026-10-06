import type { Product } from "@/lib/types/product";
import { siteConfig } from "@/lib/config/site";
import { excerpt, htmlToPlainText } from "@/lib/rich-text/format";
import { localizeLabel } from "@/lib/utils/localize";

/**
 * schema.org builders. REVOLT is an online-only store based in Arequipa, so
 * the organization is an `OnlineStore` (no street address or opening hours);
 * products carry price/availability for rich results.
 */

const base = siteConfig.url;
const storeId = `${base}/#tienda`;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productPath(slug: string): string {
  return `/laptops/${slug}`;
}

export function organizationJsonLd() {
  const { business, whatsapp } = siteConfig;
  const sameAs = siteConfig.socials.map((social) => social.href).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": storeId,
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    description: siteConfig.description,
    url: base,
    logo: absoluteUrl("/logo-revolt.png"),
    image: absoluteUrl("/logo-revolt.png"),
    telephone: `+${whatsapp.phone}`,
    currenciesAccepted: "PEN, USD",
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    areaServed: [
      { "@type": "City", name: business.city },
      { "@type": "Country", name: business.countryName },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${whatsapp.phone}`,
      contactType: "sales",
      areaServed: business.country,
      availableLanguage: ["es"],
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#web`,
    name: siteConfig.name,
    url: base,
    inLanguage: siteConfig.locale,
    publisher: { "@id": storeId },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faq: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function itemListJsonLd(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: siteConfig.home.inventory.title,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(productPath(product.slug)),
      name: product.name,
    })),
  };
}

/** Plain-text summary of a product for meta descriptions and JSON-LD. */
export function productSummary(product: Product, max = 158): string {
  const text = htmlToPlainText(product.description);
  if (text) return excerpt(text, max);
  const specs = [product.processor, product.ram, product.storage].filter(Boolean).join(", ");
  return excerpt(
    `${product.name} reacondicionada${specs ? ` (${localizeLabel(specs)})` : ""}. Revisada por técnicos y con todo funcional. Envíos a todo el Perú desde Arequipa.`,
    max,
  );
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(productPath(product.slug));
  const additionalProperty = [
    product.processor && { name: "Procesador", value: localizeLabel(product.processor) },
    product.ram && { name: "Memoria RAM", value: product.ram },
    product.storage && { name: "Almacenamiento", value: product.storage },
    product.display && { name: "Pantalla", value: product.display },
    ...product.specs.map((spec) => ({ name: localizeLabel(spec.label), value: localizeLabel(spec.value) })),
  ]
    .filter((spec): spec is { name: string; value: string } => Boolean(spec))
    .map((spec) => ({ "@type": "PropertyValue", ...spec }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#producto`,
    name: product.name,
    description: productSummary(product, 500),
    sku: product.slug,
    url,
    image: product.images.length ? product.images.map((image) => absoluteUrl(image)) : [absoluteUrl("/logo-revolt.png")],
    brand: { "@type": "Brand", name: product.brand },
    category: "Laptops reacondicionadas",
    itemCondition: "https://schema.org/RefurbishedCondition",
    ...(additionalProperty.length ? { additionalProperty } : {}),
    offers: {
      "@type": "Offer",
      url,
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/RefurbishedCondition",
      seller: { "@id": storeId },
      areaServed: { "@type": "Country", name: siteConfig.business.countryName },
    },
  };
}
