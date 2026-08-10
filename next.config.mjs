/**
 * Next.js config. Image remote patterns are derived from the Supabase URL
 * (no hardcoded project ref) plus the hosts used by the seeded demo images.
 */

/** @type {import('next').NextConfig} */
const remotePatterns = [
  { protocol: "https", hostname: "lh3.googleusercontent.com" },
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "drive.google.com" },
  { protocol: "https", hostname: "greengreenstore.co.uk" },
  { protocol: "https", hostname: "www.greengreenstore.co.uk" },
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

const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns},
};

export default nextConfig;
