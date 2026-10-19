import { getProducts } from "@/lib/repositories/products";
import { absoluteUrl, productPath, productSummary } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/config/site";
import { IN_TRANSIT_ETA_DAYS, isInTransit } from "@/lib/types/product";

/**
 * Google Merchant Center product feed (RSS 2.0 + g: namespace) for free
 * listings in Google Shopping. Add it in Merchant Center → Products → Feeds
 * as a scheduled fetch of https://<domain>/feed/google-merchant.xml.
 */
export const revalidate = 3600;

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const products = await getProducts().catch(() => []);

  const items = products
    .map((product) => {
      const [image, ...extra] = product.images.map((url) => absoluteUrl(url));
      const tags = [
        `<g:id>${escape(product.slug)}</g:id>`,
        `<title>${escape(`${product.name} reacondicionada`.slice(0, 150))}</title>`,
        `<description>${escape(productSummary(product, 4900))}</description>`,
        `<link>${escape(absoluteUrl(productPath(product.slug)))}</link>`,
        image ? `<g:image_link>${escape(image)}</g:image_link>` : "",
        ...extra.slice(0, 10).map((url) => `<g:additional_image_link>${escape(url)}</g:additional_image_link>`),
        // En camino: Google exige la fecha estimada de llegada para "backorder".
        ...(isInTransit(product)
          ? [
              `<g:availability>backorder</g:availability>`,
              `<g:availability_date>${new Date(Date.now() + IN_TRANSIT_ETA_DAYS * 86_400_000).toISOString().slice(0, 10)}</g:availability_date>`,
            ]
          : [`<g:availability>${product.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>`]),
        `<g:price>${product.price.toFixed(2)} ${product.currency}</g:price>`,
        `<g:condition>refurbished</g:condition>`,
        `<g:brand>${escape(product.brand)}</g:brand>`,
        `<g:google_product_category>328</g:google_product_category>`,
        `<g:product_type>Computadoras &gt; Laptops &gt; Laptops reacondicionadas</g:product_type>`,
        `<g:identifier_exists>no</g:identifier_exists>`,
      ];
      return `<item>${tags.filter(Boolean).join("")}</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>${escape(siteConfig.legalName)}</title>
<link>${escape(siteConfig.url)}</link>
<description>${escape(siteConfig.description)}</description>
${items}
</channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
