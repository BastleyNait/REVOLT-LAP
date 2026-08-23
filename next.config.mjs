/**
 * Next.js config. Image remote patterns are derived from the Supabase URL
 * (no hardcoded project ref) plus the hosts used by the seeded demo images.
 */

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

const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns},
};

export default nextConfig;
