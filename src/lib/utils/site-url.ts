import { headers } from "next/headers";
import { siteConfig } from "@/lib/config/site";

/**
 * Resolve the site base URL from the incoming request so generated links
 * (WhatsApp deep links, etc.) always point at the domain the visitor is
 * actually browsing — local, preview or production. Falls back to the
 * configured value when request headers are unavailable (build time).
 */
export async function resolveSiteUrl(): Promise<string> {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    if (!host) return siteConfig.url;
    const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
    return `${proto}://${host}`;
  } catch {
    return siteConfig.url;
  }
}
