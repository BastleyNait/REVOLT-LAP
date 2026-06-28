import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getProductBySlug } from "@/lib/repositories/products";
import { siteConfig } from "@/lib/config/site";
import { discountPercent, formatPrice } from "@/lib/utils/format";
import { productCover } from "@/lib/types/product";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SpecBox, type SpecColor } from "@/components/product/SpecBox";
import { WhatsappOrderButton } from "@/components/product/WhatsappButton";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

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

  const productUrl = `${siteConfig.url}/products/${product.slug}`;
  const discount = discountPercent(product.price, product.originalPrice);

  const specs = [
    product.processor && { label: "PROCESSOR", value: product.processor },
    product.ram && { label: "MEMORY", value: product.ram },
    product.storage && { label: "STORAGE", value: product.storage },
    product.display && { label: "DISPLAY", value: product.display },
    product.batteryHealth && { label: "BATTERY HEALTH", value: product.batteryHealth },
    ...product.specs,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="relative flex-1 bg-dots">
      <div className="relative mx-auto my-8 max-w-[1440px] border-x-thick border-on-background bg-surface/90 px-4 py-10 shadow-neo-md md:px-margin-edge md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8 inline-flex flex-wrap items-center gap-2 border-thick border-on-background bg-surface-container-lowest p-2 font-label-mono text-label-mono font-bold uppercase shadow-neo-xs">
          <Link href="/" className="px-2 hover:bg-primary-container hover:text-on-container">
            Inventory
          </Link>
          <span>/</span>
          <Link href="/#inventario" className="px-2 hover:bg-primary-container hover:text-on-container">
            {product.brand}
          </Link>
          <span>/</span>
          <span className="border-thin border-on-background bg-primary-container px-2 text-on-container">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} alt={product.name} grade={product.conditionGrade} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="relative overflow-hidden border-thick border-on-background bg-surface-container-lowest p-6 shadow-neo-md md:p-8">
              <h1 className="relative z-10 font-headline-lg text-headline-lg-mobile font-black uppercase leading-none md:text-headline-lg">
                {product.name}
              </h1>

              <div className="relative z-10 mt-5 inline-block -rotate-3 border-thick border-secondary-container bg-on-container p-5 shadow-[8px_8px_0px_0px_rgb(255_138_194)]">
                <span className="block font-display-lg text-display-lg leading-none tracking-tighter text-primary-fixed">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="mt-2 inline-block rotate-2 bg-secondary-container px-2 py-1 font-label-mono text-label-mono uppercase text-on-container">
                  {discount ? `SAVE ${discount}%` : "NO CORPORATE MARKUP"}
                </span>
              </div>

              {product.description ? (
                <p className="relative z-10 mt-6 bg-surface-container-lowest/80 p-2 font-body-lg text-body-lg">
                  {product.description}
                </p>
              ) : null}
            </div>

            {specs.length ? (
              <div className="grid grid-cols-1 gap-6">
                {specs.map((spec, index) => (
                  <SpecBox
                    key={spec.label}
                    label={spec.label}
                    value={spec.value}
                    color={specColors[index % specColors.length]}
                    rotate={index % 2 === 0}
                  />
                ))}
              </div>
            ) : null}

            <WhatsappOrderButton product={product} productUrl={productUrl} />

            <div className="flex flex-wrap justify-center gap-4">
              {siteConfig.product.trustBadges.map((badge, index) => (
                <Badge
                  key={badge.label}
                  color={index % 2 === 0 ? "aqua" : "lavender"}
                  className={cn("gap-2", index % 2 === 0 ? "rotate-2" : "-rotate-2")}
                >
                  <Icon name={badge.icon} className="text-lg" /> {badge.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {product.verdict ? (
          <section className="mt-16 border-thick border-on-background bg-surface-container-lowest p-6 shadow-neo-md md:p-10">
            <h2 className="mb-4 inline-block -rotate-1 bg-on-container px-4 py-2 font-display-lg text-headline-lg-mobile font-black uppercase text-primary-fixed">
              THE VERDICT
            </h2>
            <p className="font-body-lg text-body-lg">{product.verdict}</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
