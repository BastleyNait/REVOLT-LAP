/**
 * Next.js config. Image remote patterns are derived from the Supabase URL
 * (no hardcoded project ref) plus the hosts used by the seeded demo images.
 */

import { networkInterfaces } from "node:os";

/**
 * LAN IPs of this machine. Next.js 16 blocks dev-only resources (JS chunks,
 * HMR) for any host other than localhost, so opening the dev server from a
 * phone or another laptop (http://192.168.x.x:3000) rendered the page without
 * JavaScript. Development only; it has no effect on production builds.
 */
const lanHosts = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net && net.family === "IPv4" && !net.internal)
  .map((net) => net.address);

/** @type {import('next').NextConfig} */
const remotePatterns = [
  { protocol: "https", hostname: "lh3.googleusercontent.com" },
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "drive.google.com" },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    remotePatterns.push({ protocol: "https", hostname: new URL(supabaseUrl).hostname });
  } catch {
    // ignore malformed URL during local/dev
  }
} else {
  // Allow any Supabase storage bucket until the project URL is configured.
  remotePatterns.push({ protocol: "https", hostname: "*.supabase.co" });
}

const r2PublicUrl = process.env.R2_PUBLIC_URL;
if (r2PublicUrl) {
  try {
    remotePatterns.push({ protocol: "https", hostname: new URL(r2PublicUrl).hostname });
  } catch {
    // ignore malformed URL during local/dev
  }
} else {
  // Allow R2 default edge domains until the project URL is configured.
  remotePatterns.push({ protocol: "https", hostname: "*.r2.dev" });
  remotePatterns.push({ protocol: "https", hostname: "r2.dev" });
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: lanHosts,
  poweredByHeader: false,
  images: {
    remotePatterns,
    // AVIF first (smallest), WebP fallback. Product photos are cached for a
    // month on the edge since their URLs change whenever they are replaced.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    return [
      // Product pages moved to Spanish, keyword-rich URLs. Permanent (308) so
      // links already shared on WhatsApp and any indexed URLs keep working.
      { source: "/products/:slug", destination: "/laptops/:slug", permanent: true },
      { source: "/sobre-nosotros", destination: "/nosotros", permanent: true },
    ];
  },
  async headers() {
    // HSTS is already sent by Vercel on every HTTPS domain.
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
