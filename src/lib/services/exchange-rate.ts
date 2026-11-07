import "server-only";
import { siteConfig } from "@/lib/config/site";

/**
 * Live USD → PEN rate (mid-market) from open.er-api.com: free, no API key.
 * The response is cached in the Next.js data cache for 6 hours, so the API is
 * hit about four times a day no matter the traffic. If the request fails or
 * returns something unreasonable, the fixed reference rate from the config
 * (`siteConfig.usdRate`, 3.5) is used instead — prices never break.
 */
const RATE_URL = "https://open.er-api.com/v6/latest/USD";
const REVALIDATE_SECONDS = 6 * 60 * 60;
/** Sanity range for PEN per USD; anything outside it is treated as a bad response. */
const MIN_RATE = 3;
const MAX_RATE = 4.5;

export async function getUsdRate(): Promise<number> {
  const fallback = siteConfig.usdRate;
  try {
    const res = await fetch(RATE_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
    const rate = data.rates?.PEN;
    if (data.result !== "success" || typeof rate !== "number" || rate < MIN_RATE || rate > MAX_RATE) return fallback;
    return rate;
  } catch {
    return fallback;
  }
}
