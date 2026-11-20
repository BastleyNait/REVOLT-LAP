import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { isInTransit, productCover } from "@/lib/types/product";
import { siteConfig } from "@/lib/config/site";
import { formatPrice, formatUsdEquivalent } from "@/lib/utils/format";
import { localizeLabel, withCapacityUnit } from "@/lib/utils/localize";
import { productPath } from "@/lib/seo/structured-data";
import { SafeImage } from "@/components/ui/SafeImage";
import { Icon } from "@/components/ui/Icon";
import { CarouselTrack } from "./CarouselTrack";
import { getUsdRate } from "@/lib/services/exchange-rate";
import { getCouponPen } from "@/lib/repositories/settings";

/** Laptops per carousel page (stacked rows). */
const PER_PAGE = 2;

function FeaturedRow({ product, eager, usdRate, couponPen }: { product: Product; eager: boolean; usdRate: number; couponPen: number }) {
  const usd = formatUsdEquivalent(product.price, product.currency, usdRate);
  const inTransit = isInTransit(product);
  const coupon = inTransit && product.currency === "PEN" ? formatPrice(couponPen, "PEN") : null;
  const specs = [
    product.processor && localizeLabel(product.processor),
    product.ram && withCapacityUnit(product.ram),
    product.storage && withCapacityUnit(product.storage),
  ].filter(Boolean);
  const status = inTransit
    ? { label: "En camino · 10 a 15 días", dot: "bg-deal", text: "text-deal" }
    : product.stock <= 2
      ? { label: product.stock === 1 ? "Unidad única" : "Últimas unidades", dot: "bg-deal", text: "text-deal" }
      : { label: "En stock", dot: "bg-primary", text: "text-primary" };

  return (
    <Link
      href={productPath(product.slug)}
      className="group grid grid-cols-[6.75rem_1fr] items-center gap-4 rounded-[1.4rem] p-2 outline-none transition-colors duration-200 hover:bg-white/[0.035] focus-visible:ring-2 focus-visible:ring-primary/60 xl:grid-cols-[7.5rem_1fr]"
    >
      {/* photo: no frame, it melts into the panel on its right edge */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/40">
        <SafeImage
          src={productCover(product)}
          alt={`${product.name} reacondicionada`}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1280px) 7.5rem, 6.75rem"
          className="object-cover brightness-[0.92] contrast-[1.08] saturate-[1.1] transition-transform duration-500 ease-out-strong group-hover:scale-[1.05]"
        />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,transparent_55%,rgb(3_17_11/0.55))]" />
        {coupon ? (
          <span
            aria-label={`Cupón de ${coupon} al reservar`}
            className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-center gap-1 rounded-full bg-[linear-gradient(90deg,#ea580c,#f97316)] py-1 text-[0.6875rem] font-extrabold text-white shadow-[0_4px_14px_rgb(234_88_12/0.5)]"
          >
            <Icon name="deal" className="text-xs" /> -{coupon}
          </span>
        ) : null}
      </div>

      <div className="min-w-0">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-primary">{product.brand}</p>
        <h3 className="mt-1 line-clamp-3 text-[0.9375rem] font-bold leading-snug text-white transition-colors duration-200 group-hover:text-primary">
          {product.name}
        </h3>
        {specs.length ? <p className="mt-1 line-clamp-1 text-[0.8125rem] font-medium text-white/75">{specs.join(" · ")}</p> : null}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-display text-xl font-extrabold leading-none tracking-tight text-[#c8ffe9]">
            {formatPrice(product.price, product.currency)}
          </span>
          {usd ? <span className="text-xs text-white/45">o {usd}</span> : null}
        </div>
        <p className={`mt-1.5 flex items-center gap-1.5 text-xs font-semibold ${status.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse motion-reduce:animate-none`} />
          {status.label}
        </p>
      </div>
    </Link>
  );
}

/**
 * Hero carousel of the featured laptops (marked "Destacado" in the admin):
 * pages of two rows — photo left, details right. No borders: the panel, the
 * photos and the dividers are gradients that fade into the hero background.
 */
export async function FeaturedCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const [usdRate, couponPen] = await Promise.all([getUsdRate(), getCouponPen()]);
  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += PER_PAGE) pages.push(products.slice(i, i + PER_PAGE));

  return (
    <CarouselTrack
      label="Laptops destacadas"
      itemLabel="la página"
      heading={
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
          <Icon name="sparkles" className="text-base text-primary" />
          {siteConfig.home.hero.featuredLabel}
        </p>
      }
      slides={pages.map((page, p) => (
        <div key={p} className="flex flex-col">
          {page.map((product, i) => (
            <div key={product.id}>
              {i > 0 ? <div aria-hidden className="mx-3 my-1 h-px bg-[linear-gradient(90deg,transparent,rgb(18_180_128/0.35),transparent)]" /> : null}
              <FeaturedRow product={product} eager={p === 0} usdRate={usdRate} couponPen={couponPen} />
            </div>
          ))}
        </div>
      ))}
    />
  );
}
