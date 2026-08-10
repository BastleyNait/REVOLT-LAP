/**
 * Shared list of allowed image hostnames.
 * Used by:
 *  - next.config.mjs (to build remotePatterns)
 *  - SafeImage component (to validate URLs before passing to next/image)
 *
 * Keep this in sync with next.config.mjs remotePatterns.
 */

export const ALLOWED_IMAGE_HOSTS = [
  "lh3.googleusercontent.com",
  "images.unsplash.com",
  "drive.google.com",
  "greengreenstore.co.uk",
  "www.greengreenstore.co.uk",
  // Supabase wildcard — any *.supabase.co subdomain
  "supabase.co",
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
