import type { Metadata, Viewport } from "next";
import { Archivo_Narrow } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageBackground } from "@/components/layout/PageBackground";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";
import "./globals.css";

// Archivo Narrow — the store's original typeface: condensed, squared letters
// that sit well next to the logo. One variable font for headings and text.
const archivo = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#010201",
  colorScheme: "dark",
  // Paint under the notch; fixed bars pad themselves with env(safe-area-inset-*).
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "technology",
  openGraph: {
    type: "website",
    locale: siteConfig.ogLocale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
  // Optional: paste the Google Search Console / Bing verification tokens here
  // through env vars once the custom domain is live.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  other: {
    "geo.region": "PE-ARE",
    "geo.placename": siteConfig.business.city,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" className={cn("dark", archivo.variable)}>
      <body suppressHydrationWarning className="flex min-h-screen flex-col font-sans">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-bold focus:text-on-primary"
        >
          Saltar al contenido
        </a>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <PageBackground />
        <Navbar />
        <div id="contenido" className="flex flex-1 flex-col">
          {children}
        </div>
        <Footer />
        {/* Vercel Web Analytics + Speed Insights (their scripts only exist on Vercel deployments). */}
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
