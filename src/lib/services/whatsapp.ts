import type { Product } from "@/lib/types/product";
import { siteConfig } from "@/lib/config/site";
import { formatPrice } from "@/lib/utils/format";

interface WhatsappOptions {
  phone?: string;
  message?: string;
  /** Absolute URL of the product page, appended so the seller has context. */
  productUrl?: string;
}

/**
 * Build a `wa.me` deep link prefilled with the product the buyer is interested
 * in. Falls back to a generic share link when no phone number is configured.
 * Only product/marketing data is encoded — never personal buyer data.
 */
export function buildWhatsappUrl(
  product: Pick<Product, "name" | "price" | "currency">,
  options: WhatsappOptions = {},
): string {
  const phone = options.phone ?? siteConfig.whatsapp.phone;
  const message = options.message ?? siteConfig.whatsapp.defaultMessage;

  const lines = [message, `*${product.name}* — ${formatPrice(product.price, product.currency)}`];
  if (options.productUrl) lines.push(options.productUrl);

  const endpoint = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${endpoint}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** Generic "contact us" WhatsApp link (navbar / footer), no specific product. */
export function generalWhatsappUrl(message: string = siteConfig.whatsapp.defaultMessage): string {
  const phone = siteConfig.whatsapp.phone;
  const endpoint = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${endpoint}?text=${encodeURIComponent(message)}`;
}
