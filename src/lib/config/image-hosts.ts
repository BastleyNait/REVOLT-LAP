/**
 * Shared list of allowed image hostnames.
 * Used by:
 *  - next.config.mjs (to build remotePatterns)
 *  - SafeImage component (to validate URLs before passing to next/image)
 *
 * Keep this in sync with next.config.mjs remotePatterns.
 */

// R2 public hostname is read from env — allows dynamic bucket domains
const r2Hostname = (() => {
  const url = process.env.R2_PUBLIC_URL ?? "";
  if (!url) return "";
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
})();

export const ALLOWED_IMAGE_HOSTS = [
  "lh3.googleusercontent.com",
  "images.unsplash.com",
  "drive.google.com",
  // Supabase wildcard — any *.supabase.co subdomain
  "supabase.co",
  // Cloudflare R2 public bucket URL
  ...(r2Hostname ? [r2Hostname] : []),
  // R2 default edge domain
  "r2.dev",
] as const;

/**
 * Check if an image URL points to an allowed hostname.
 * Data URIs and relative paths always pass (they bypass remote validation).
 */
export function isAllowedImageHost(url: string): boolean {
  if (typeof url !== "string") return false;
  // Data URIs and relative paths are always safe — next/image handles them natively
  if (url.startsWith("data:") || url.startsWith("/") || url.startsWith("./")) {
    return true;
  }
  try {
    const { hostname } = new URL(url);
    return ALLOWED_IMAGE_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}
