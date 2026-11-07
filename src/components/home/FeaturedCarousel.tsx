import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { isInTransit, productCover } from "@/lib/types/product";
import { siteConfig } from "@/lib/config/site";
import { discountPercent, formatPrice, formatUsdEquivalent } from "@/lib/utils/format";
import { localizeLabel, withCapacityUnit } from "@/lib/utils/localize";
import { productPath } from "@/lib/seo/structured-data";
import { SafeImage } from "@/components/ui/SafeImage";
import { Icon } from "@/components/ui/Icon";
import { StockStatus } from "@/components/product/StockStatus";
import { CarouselTrack } from "./CarouselTrack";
import { getUsdRate } from "@/lib/services/exchange-rate";

function FeaturedSlide({ product, eager, usdRate }: { product: Product; eager: boolean; usdRate: number }) {
  const discount = discountPercent(product.price, product.originalPrice);
  const usd = formatUsdEquivalent(product.price, product.currency, usdRate);
  const specs = [
    product.processor && localizeLabel(product.processor),
    product.ram && withCapacityUnit(product.ram),
    product.storage && withCapacityUnit(product.storage),
  ].filter(Boolean);

  return (
    <Link
      href={productPath(product.slug)}
      className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/40">
        <SafeImage
          src={productCover(product)}
          alt={`${product.name} reacondicionada`}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1280px) 20rem, (min-width: 1024px) 17rem, 90vw"
          className="object-cover brightness-[0.9] contrast-[1.1] saturate-[1.1] transition-transform duration-500 ease-out-strong group-hover:scale-[1.03]"
        />
        {discount ? (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-deal-strong px-2.5 py-1 text-xs font-bold text-on-deal">-{discount}%</span>
        ) : null}
      </div>

      <div className="mt-3 space-y-1.5 px-1">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-primary">{product.brand}</p>
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-white transition-colors duration-200 group-hover:text-primary">
          {product.name}
        </h3>
        {specs.length ? <p className="line-clamp-1 text-sm text-white/60">{specs.join(" · ")}</p> : null}
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2 pt-1">
          <div>
            <p className="font-display text-2xl font-extrabold leading-none tracking-tight text-[#c8ffe9]">
              {formatPrice(product.price, product.currency)}
            </p>
            {usd ? <p className="mt-1 text-xs text-white/50">o {usd}</p> : null}
          </div>
          <StockStatus stock={product.stock} inTransit={isInTransit(product)} compact pill />
        </div>
      </div>
    </Link>
  );
}

/**
 * Hero carousel of the featured laptops (the ones marked "Destacado" in the
 * admin). Slides render on the server; only the scrolling is client-side.
 */
export async function FeaturedCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const usdRate = await getUsdRate();

  return (
    <CarouselTrack
      label="Laptops destacadas"
      heading={
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
          <Icon name="sparkles" className="text-base text-primary" />
          {siteConfig.home.hero.featuredLabel}
        </p>
      }
      slides={products.map((product, i) => (
        <FeaturedSlide key={product.id} product={product} eager={i === 0} usdRate={usdRate} />
      ))}
    />
  );
}
