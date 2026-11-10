import { getProducts } from "@/lib/repositories/products";
import { siteConfig } from "@/lib/config/site";
import type { Sender } from "@/lib/envios/types";
import { EnviosApp } from "@/components/envios/EnviosApp";

export const dynamic = "force-dynamic";

/**
 * REVOLT Envíos (/envios): a form that builds the shipment PDF — 6 box
 * labels, the shipping sheet, the thank-you letter and the warranty. Behind the
 * admin password (see proxy.ts); installable as a PWA.
 */
export default async function EnviosPage() {
  const { business, whatsapp, warranty } = siteConfig;
  const web = siteConfig.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const sender: Sender = {
    brand: siteConfig.name,
    holder: business.accountHolder || siteConfig.legalName,
    ruc: business.ruc,
    phoneDisplay: whatsapp.display,
    whatsappUrl: `https://wa.me/${whatsapp.phone}`,
    city: business.city,
    web: /localhost|127\.0\.0\.1/.test(web) ? "revolt-laptops.com" : web,
    reviewUrl: business.googleBusinessUrl || siteConfig.url,
    warrantyMonths: warranty.months,
  };

  // Laptop names for the autocomplete (newest first, sold ones included).
  const products = await getProducts().catch(() => []);
  const laptops = Array.from(new Set(products.map((p) => p.name)));

  return <EnviosApp sender={sender} laptops={laptops} />;
}
