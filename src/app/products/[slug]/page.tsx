import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getProductBySlug } from "@/lib/repositories/products";
import { siteConfig } from "@/lib/config/site";
import { discountPercent, formatPrice, formatUsdEquivalent } from "@/lib/utils/format";
import { resolveSiteUrl } from "@/lib/utils/site-url";
import { productCover } from "@/lib/types/product";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SpecBox, type SpecColor } from "@/components/product/SpecBox";
import { WhatsappOrderButton } from "@/components/product/WhatsappButton";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

export const revalidate = 60;

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.name,
    description: product.description ?? siteConfig.description,
    openGraph: {
      title: product.name,
      description: product.description ?? siteConfig.description,
      images: product.images.length ? [productCover(product)] : [],
    },
  };
}

const specColors: SpecColor[] = ["aqua", "lavender", "orange", "white"];

export default async function ProductPage({ params }: PageParams) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const baseUrl = await resolveSiteUrl();
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const discount = discountPercent(product.price, product.originalPrice);
  const usd = formatUsdEquivalent(product.price, product.currency);

  const specs = [
    product.processor && { label: "PROCESSOR", value: product.processor },
    product.ram && { label: "MEMORY", value: product.ram },
    product.storage && { label: "STORAGE", value: product.storage },
    product.display && { label: "DISPLAY", value: product.display },
    product.batteryHealth && { label: "BATTERY HEALTH", value: product.batteryHealth },
    ...product.specs,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="relative flex-1">
      <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
          <Link href="/" className="transition-colors hover:text-on-background">
            Inventario
          </Link>
          <Icon name="chevron_right" className="text-base" />
          <Link href="/#inventario" className="transition-colors hover:text-on-background">
            {product.brand}
          </Link>
          <Icon name="chevron_right" className="text-base" />
          <span className="font-semibold text-on-background">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} alt={product.name} grade={product.conditionGrade} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="glass rounded-3xl p-6 md:p-8">
              <h1 className="font-display-lg text-3xl font-black leading-tight tracking-tight md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-end gap-3">
                <span className="font-display-lg text-5xl font-black leading-none tracking-tight text-gradient md:text-6xl">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice ? (
                  <span className="pb-1 text-lg text-on-surface-variant line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                ) : null}
              </div>
              {usd ? (
                <p className="mt-2 text-sm font-medium text-on-surface-variant">
                  o paga en dólares: <span className="font-bold text-on-background">{usd}</span>
                </p>
              ) : null}
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary">
                <Icon name="sell" className="text-sm" />
                {discount ? `Ahorras ${discount}%` : "Sin sobreprecio corporativo"}
              </span>

              {product.description ? (
                <p className="mt-6 text-base leading-relaxed text-on-surface-variant">
                  {product.description}
                </p>
              ) : null}
            </div>

            {specs.length ? (
              <div className="grid grid-cols-1 gap-3">
                {specs.map((spec, index) => (
                  <SpecBox
                    key={spec.label}
                    label={spec.label}
                    value={spec.value}
                    color={specColors[index % specColors.length]}
                  />
                ))}
              </div>
            ) : null}

            <WhatsappOrderButton product={product} productUrl={productUrl} />

            <div className="flex flex-wrap justify-center gap-3">
              {siteConfig.product.trustBadges.map((badge, index) => (
                <Badge key={badge.label} color={index % 2 === 0 ? "aqua" : "lavender"} className="gap-1.5">
                  <Icon name={badge.icon} className="text-base" /> {badge.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {product.verdict ? (
          <section className="glass mt-12 rounded-3xl p-6 shadow-neo md:p-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              El veredicto
            </h2>
            <p className="text-lg leading-relaxed">{product.verdict}</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
