import type { Product } from "@/lib/types/product";
import { siteConfig } from "@/lib/config/site";
import { formatPrice, formatUsdEquivalent } from "@/lib/utils/format";

interface WhatsappOptions {
  phone?: string;
  message?: string;
  /** Absolute URL of the product page, appended so the seller has context. */
  productUrl?: string;
}

/**
 * Build a `wa.me` deep link prefilled with the product the buyer is interested
 * in, addressed to the store's number (`siteConfig.whatsapp.phone`).
 * Only product/marketing data is encoded — never personal buyer data.
 */
export function buildWhatsappUrl(
  product: Pick<Product, "name" | "price" | "currency">,
  options: WhatsappOptions = {},
): string {
  const phone = (options.phone ?? siteConfig.whatsapp.phone).replace(/\D/g, "");
  const message = options.message ?? siteConfig.whatsapp.defaultMessage;

  const usd = formatUsdEquivalent(product.price, product.currency);
  const priceLabel = usd
    ? `${formatPrice(product.price, product.currency)} (o ${usd})`
    : formatPrice(product.price, product.currency);
  const lines = [message, `*${product.name}* — ${priceLabel}`];
  if (options.productUrl) lines.push(options.productUrl);

  const endpoint = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${endpoint}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** Generic "contact us" WhatsApp link (navbar / footer), no specific product. */
export function generalWhatsappUrl(message: string = siteConfig.whatsapp.generalMessage): string {
  return `https://wa.me/${siteConfig.whatsapp.phone}?text=${encodeURIComponent(message)}`;
}
