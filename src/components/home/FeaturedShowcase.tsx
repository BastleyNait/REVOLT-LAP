import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { isInTransit, productCover } from "@/lib/types/product";
import { siteConfig } from "@/lib/config/site";
import { formatPrice, formatUsdEquivalent } from "@/lib/utils/format";
import { localizeLabel, withCapacityUnit } from "@/lib/utils/localize";
import { productPath } from "@/lib/seo/structured-data";
import { SafeImage } from "@/components/ui/SafeImage";
import { Icon } from "@/components/ui/Icon";
import { getUsdRate } from "@/lib/services/exchange-rate";
import { getCouponPen } from "@/lib/repositories/settings";

/** Most featured laptops shown at once (the rest are one click away in the catalogue). */
const MAX = 4;

function view(product: Product, usdRate: number, couponPen: number) {
  const usd = formatUsdEquivalent(product.price, product.currency, usdRate);
  const inTransit = isInTransit(product);
  const coupon = inTransit && product.currency === "PEN" ? formatPrice(couponPen, "PEN") : null;
  const specs = [
    product.processor && localizeLabel(product.processor),
    product.ram && withCapacityUnit(product.ram),
    product.storage && withCapacityUnit(product.storage),
  ].filter(Boolean) as string[];
  const status = inTransit
    ? { label: "En camino · 10 a 15 días", dot: "bg-deal", text: "text-deal" }
    : product.stock <= 2
      ? { label: product.stock === 1 ? "Unidad única" : "Últimas unidades", dot: "bg-deal", text: "text-deal" }
      : { label: "En stock", dot: "bg-primary", text: "text-primary" };
  return { usd, coupon, specs, status };
}

/** Compact row: photo left, details right (laptop widths). */
function FeaturedRow({ product, usdRate, couponPen }: { product: Product; usdRate: number; couponPen: number }) {
  const { usd, coupon, status, specs } = view(product, usdRate, couponPen);

  return (
    <Link
      href={productPath(product.slug)}
      className="group grid grid-cols-[6.75rem_1fr] short:grid-cols-[5.75rem_1fr] items-center gap-4 rounded-[1.4rem] p-2 outline-none transition-colors duration-200 hover:bg-white/[0.035] focus-visible:ring-2 focus-visible:ring-primary/60 xl:grid-cols-[7.5rem_1fr]"
    >
      {/* photo: no frame, it melts into the panel on its right edge */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/40">
        <SafeImage
          src={productCover(product)}
          alt={`${product.name} reacondicionada`}
          fill
          loading="lazy"
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
        <h3 className="mt-1 line-clamp-3 short:line-clamp-2 text-[0.9375rem] font-bold leading-snug text-white transition-colors duration-200 group-hover:text-primary">
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

/** Card: photo on top (phones in a 2-column grid, and big screens in a 2×2 grid). */
function FeaturedCard({ product, usdRate, couponPen }: { product: Product; usdRate: number; couponPen: number }) {
  const { usd, coupon, specs, status } = view(product, usdRate, couponPen);
  return (
    <Link
      href={productPath(product.slug)}
      className="group flex h-full flex-col rounded-[1.4rem] p-1.5 outline-none transition-colors duration-200 hover:bg-white/[0.035] focus-visible:ring-2 focus-visible:ring-primary/60 wide:p-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/40 wide:aspect-[16/9]">
        <SafeImage
          src={productCover(product)}
          alt={`${product.name} reacondicionada`}
          fill
          loading="lazy"
          sizes="(min-width: 1600px) 20vw, (min-width: 1024px) 1px, 45vw"
          className="object-cover brightness-[0.92] contrast-[1.08] saturate-[1.1] transition-transform duration-500 ease-out-strong group-hover:scale-[1.04]"
        />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(3_17_11/0.6))]" />
        {coupon ? (
          <span
            aria-label={`Cupón de ${coupon} al reservar`}
            className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-[linear-gradient(90deg,#ea580c,#f97316)] px-2.5 py-1 text-[0.6875rem] font-extrabold text-white shadow-[0_4px_14px_rgb(234_88_12/0.5)] wide:text-xs"
          >
            <Icon name="deal" className="text-xs" /> -{coupon} al reservar
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col px-1 pt-2.5 wide:px-1.5 wide:pt-2">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-primary">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-[0.8125rem] font-bold leading-snug text-white transition-colors duration-200 group-hover:text-primary sm:text-[0.9375rem] wide:text-base">
          {product.name}
        </h3>
        {specs.length ? (
          <div className="hidden sm:block">
            <p className="mt-1 line-clamp-1 text-[0.8125rem] font-medium text-white/75">{specs.join(" · ")}</p>
          </div>
        ) : null}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
          <span className="font-display text-lg font-extrabold leading-none tracking-tight text-[#c8ffe9] wide:text-2xl">
            {formatPrice(product.price, product.currency)}
          </span>
          {usd ? <span className="hidden text-xs text-white/45 sm:inline">o {usd}</span> : null}
        </div>
        <p className={`mt-1.5 flex items-center gap-1.5 text-[0.6875rem] font-semibold sm:text-xs ${status.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse motion-reduce:animate-none`} />
          {status.label}
        </p>
      </div>
    </Link>
  );
}

/**
 * Hero showcase of the featured laptops (marked "Destacado" in the admin), all
 * visible at once — no carousel. Phones: 2-column grid of cards. Laptops: a
 * list of compact rows. Big screens (≥1600px): 2×2 grid of large cards.
 * No borders: a tinted panel that fades out on every side.
 */
export async function FeaturedShowcase({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const [usdRate, couponPen] = await Promise.all([getUsdRate(), getCouponPen()]);
  const shown = products.slice(0, MAX);

  return (
    <section aria-labelledby="destacadas-title" className="relative isolate p-3">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 [background:linear-gradient(160deg,rgb(18_180_128/0.1),transparent_55%),rgb(2_12_8/0.88)] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent),linear-gradient(180deg,transparent,#000_12%,#000_84%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
      />
      <div className="mb-2 flex items-center justify-between gap-3 px-2 pt-1">
        <h2 id="destacadas-title" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80 wide:text-sm">
          <Icon name="sparkles" className="text-base text-primary" />
          {siteConfig.home.hero.featuredLabel}
        </h2>
        <a href="#laptops" className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary hover:underline wide:text-sm">
          Ver todas <Icon name="arrow" className="text-sm" />
        </a>
      </div>

      {/* phones / tablets and big screens: grid of cards */}
      <ul className="grid grid-cols-2 gap-2 lg:hidden wide:grid wide:gap-3">
        {shown.map((p) => (
          <li key={p.id}>
            <FeaturedCard product={p} usdRate={usdRate} couponPen={couponPen} />
          </li>
        ))}
      </ul>

      {/* laptops: list of compact rows (3 on short screens) */}
      <ul className="hidden flex-col lg:flex wide:hidden">
        {shown.map((p, i) => (
          <li key={p.id} className={i === 3 ? "short:hidden" : undefined}>
            {i > 0 ? <div aria-hidden className="mx-3 my-1 h-px bg-[linear-gradient(90deg,transparent,rgb(18_180_128/0.35),transparent)]" /> : null}
            <FeaturedRow product={p} usdRate={usdRate} couponPen={couponPen} />
          </li>
        ))}
      </ul>
    </section>
  );
}
