import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getProductBySlug, getRelatedProducts } from "@/lib/repositories/products";
import { siteConfig } from "@/lib/config/site";
import { discountPercent, formatPrice, formatUsdEquivalent } from "@/lib/utils/format";
import { conditionLabel, localizeLabel, withCapacityUnit } from "@/lib/utils/localize";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  productJsonLd,
  productPath,
  productSummary,
} from "@/lib/seo/structured-data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { StockStatus } from "@/components/product/StockStatus";
import { WhatsappOrderButton } from "@/components/product/WhatsappButton";
import { RichText } from "@/components/ui/RichText";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";

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
  if (!product) return { title: "Laptop no encontrada", robots: { index: false, follow: true } };

  const path = productPath(product.slug);
  const title = `${product.name} · ${formatPrice(product.price, product.currency)}`;
  const description = productSummary(product);
  const images = product.images.slice(0, 4).map((url) => ({ url: absoluteUrl(url), alt: `${product.name} reacondicionada` }));

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: product.isActive ? undefined : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: siteConfig.ogLocale,
      siteName: siteConfig.name,
      url: path,
      title: `${title} | ${siteConfig.name}`,
      description,
      ...(images.length ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      ...(images.length ? { images: images.map((image) => image.url) } : {}),
    },
  };
}

export default async function ProductPage({ params }: PageParams) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const productUrl = absoluteUrl(productPath(product.slug));
  const discount = discountPercent(product.price, product.originalPrice);
  const usd = formatUsdEquivalent(product.price, product.currency);
  const savings = discount && product.originalPrice ? product.originalPrice - product.price : null;
  const condition = conditionLabel(product.conditionGrade);

  const specs = [
    product.processor && { icon: "cpu", label: "Procesador", value: localizeLabel(product.processor) },
    product.ram && { icon: "memory", label: "Memoria RAM", value: withCapacityUnit(product.ram) },
    product.storage && { icon: "storage", label: "Almacenamiento", value: withCapacityUnit(product.storage) },
    product.display && { icon: "screen", label: "Pantalla", value: localizeLabel(product.display) },
    product.batteryHealth && { icon: "battery", label: "Batería", value: localizeLabel(product.batteryHealth) },
    { icon: "verified", label: "Estado", value: condition },
    ...product.specs.map((spec) => ({ icon: "check-plain", label: localizeLabel(spec.label), value: localizeLabel(spec.value) })),
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  const breadcrumbs = [
    { name: "Inicio", path: "/" },
    { name: "Laptops", path: "/#laptops" },
    { name: product.name, path: productPath(product.slug) },
  ];

  return (
    <main className="relative flex-1">
      <JsonLd data={[productJsonLd(product), breadcrumbJsonLd(breadcrumbs)]} />

      <div className="mx-auto max-w-[75rem] px-4 pb-16 pt-6 md:px-8 md:pb-24 md:pt-10">
        <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-on-surface-variant">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition-colors hover:text-on-background">Inicio</Link>
            </li>
            <li aria-hidden><Icon name="chevron-right" className="text-base" /></li>
            <li>
              <Link href="/#laptops" className="transition-colors hover:text-on-background">Laptops {product.brand}</Link>
            </li>
            <li aria-hidden><Icon name="chevron-right" className="text-base" /></li>
            <li aria-current="page" className="line-clamp-1 max-w-[16rem] font-semibold text-on-background md:max-w-md">
              {product.name}
            </li>
          </ol>
        </nav>

        {/*
         * Desktop: gallery + details flow down the left column while the buy
         * card stays pinned on the right. Mobile order: gallery → buy → details.
         */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-14">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} alt={`${product.name} reacondicionada`} />
          </div>

          <div className="self-start lg:sticky lg:top-28 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <div className="glass rounded-3xl p-6 md:p-8">
              <p className="flex flex-wrap items-center gap-x-2 text-sm font-semibold">
                <span className="text-primary">{product.brand}</span>
                <span aria-hidden className="text-on-surface-variant">·</span>
                <span className="text-on-surface-variant">{condition}</span>
              </p>

              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight md:text-[2.1rem]">{product.name}</h1>

              <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1">
                <p className="font-display text-5xl font-extrabold leading-none tracking-tight text-white">
                  {formatPrice(product.price, product.currency)}
                </p>
                {product.originalPrice && discount ? (
                  <p className="pb-1 text-lg text-on-surface-variant">
                    <span className="sr-only">Precio anterior: </span>
                    <s>{formatPrice(product.originalPrice, product.currency)}</s>
                  </p>
                ) : null}
              </div>
              {usd ? (
                <p className="mt-2 text-on-surface-variant">
                  o paga en dólares: <span className="font-bold text-on-background">{usd}</span>
                </p>
              ) : null}
              {savings ? (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-deal-strong px-3 py-1 text-sm font-bold text-on-deal">
                  <Icon name="deal" /> Ahorras {formatPrice(savings, product.currency)} ({discount}%)
                </p>
              ) : null}

              <div className="mt-5">
                <StockStatus stock={product.stock} />
              </div>

              <div className="mt-6">
                <WhatsappOrderButton product={product} productUrl={productUrl} />
                <p className="mt-3 text-center text-sm text-on-surface-variant">
                  Te respondemos por WhatsApp y coordinamos pago y envío.
                </p>
              </div>

              <ul className="mt-6 grid gap-2.5 border-t border-white/10 pt-6">
                {siteConfig.product.trustBadges.map((badge) => (
                  <li key={badge.label} className="flex items-center gap-3 text-[0.9375rem] font-medium text-on-surface">
                    <Icon name={badge.icon} className="text-xl text-primary" /> {badge.label}
                  </li>
                ))}
              </ul>

              <p className="mt-6 flex gap-3 border-t border-white/10 pt-6 text-[0.9375rem] leading-relaxed text-on-surface-variant">
                <Icon name="verified" className="mt-0.5 text-xl text-primary" />
                <span>
                  <strong className="font-semibold text-on-surface">{siteConfig.promise.title}.</strong> {siteConfig.promise.body}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-12 lg:col-span-7 lg:row-start-2">
            <section aria-labelledby="descripcion">
              <h2 id="descripcion" className="mb-4 text-2xl font-extrabold">Descripción</h2>
              {product.description ? (
                <RichText html={product.description} />
              ) : (
                <p className="leading-relaxed text-on-surface-variant">{productSummary(product, 400)}</p>
              )}
            </section>

            <section aria-labelledby="especificaciones">
              <h2 id="especificaciones" className="mb-2 text-2xl font-extrabold">Especificaciones</h2>
              <dl className="divide-y divide-white/[0.07]">
                {specs.map((spec) => (
                  <div key={`${spec.label}-${spec.value}`} className="flex items-start justify-between gap-4 py-3.5">
                    <dt className="flex items-center gap-2.5 text-on-surface-variant">
                      <Icon name={spec.icon} className="text-lg text-primary" />
                      {spec.label}
                    </dt>
                    <dd className="text-right font-semibold">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {product.verdict ? (
              <section aria-labelledby="opinion">
                <h2 id="opinion" className="mb-4 text-2xl font-extrabold">Nuestra opinión</h2>
                <RichText html={product.verdict} className="border-l-2 border-primary/60 pl-5 text-lg text-on-surface" />
              </section>
            ) : null}
          </div>
        </div>

        {related.length ? (
          <section aria-labelledby="relacionadas" className="mt-20 space-y-8">
            <h2 id="relacionadas" className="text-2xl font-extrabold md:text-3xl">
              Otras laptops que te pueden interesar
            </h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id} className="h-full">
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {/* Mobile buy bar — the main CTA always within thumb reach */}
      <div
        data-sticky-cta
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-surface/80 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur-2xl md:hidden"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-2xl font-extrabold leading-none text-white">{formatPrice(product.price, product.currency)}</p>
            {usd ? <p className="mt-1 text-xs text-on-surface-variant">o {usd}</p> : null}
          </div>
          <WhatsappOrderButton product={product} productUrl={productUrl} compact />
        </div>
      </div>
    </main>
  );
}
