import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/repositories/products";
import { absoluteUrl, productPath } from "@/lib/seo/structured-data";
import { landingPath, landings } from "@/lib/seo/landings";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts().catch(() => []);
  const latest = products.reduce<string | undefined>(
    (max, product) => (!max || product.updatedAt > max ? product.updatedAt : max),
    undefined,
  );

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latest ? new Date(latest) : new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/laptops"),
      lastModified: latest ? new Date(latest) : new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...landings.map((landing) => ({
      url: absoluteUrl(landingPath(landing.slug)),
      lastModified: latest ? new Date(latest) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    {
      url: absoluteUrl("/opiniones"),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/como-comprar"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/nosotros"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...products.map((product) => ({
      url: absoluteUrl(productPath(product.slug)),
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: product.images.slice(0, 5).map((image) => absoluteUrl(image)),
    })),
  ];
}
