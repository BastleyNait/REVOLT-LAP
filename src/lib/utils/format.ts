import { siteConfig } from "@/lib/config/site";

/** Format a number as a currency string, e.g. 1410 -> "S/ 1,410". */
export function formatPrice(
  amount: number,
  currency: string = siteConfig.currency,
  locale: string = siteConfig.locale,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Convert a soles (PEN) amount to its USD equivalent using the site reference
 * rate. Prices are quoted in soles but buyers can also pay in dollars.
 */
export function penToUsd(amountPen: number, rate: number = siteConfig.usdRate): number {
  return Math.round(amountPen / rate);
}

/**
 * Dollar equivalent of a PEN price, formatted for the "or pay in USD" hint.
 * Returns null when the product isn't priced in soles (no conversion needed).
 */
export function formatUsdEquivalent(
  amount: number,
  currency: string = siteConfig.currency,
  rate: number = siteConfig.usdRate,
): string | null {
  if (currency !== "PEN") return null;
  return formatPrice(penToUsd(amount, rate), "USD", "en-US");
}

/** Percentage saved when an original price is present. */
export function discountPercent(price: number, originalPrice: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/** URL-safe slug from arbitrary text. */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Split a textarea value into a trimmed, non-empty array (one item per line). */
export function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
