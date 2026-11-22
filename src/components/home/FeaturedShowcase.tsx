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

/**
 * Hero spotlight: ONE featured laptop (the newest marked "Destacado" in the
 * admin), big and calm: photo, name, key specs, price and a single action.
 * No borders: a tinted panel that fades out on every side into the hero.
 */
export async function FeaturedShowcase({ products }: { products: Product[] }) {
  const product = products[0];
  if (!product) return null;
  const [usdRate, couponPen] = await Promise.all([getUsdRate(), getCouponPen()]);
  const { usd, coupon, specs, status } = view(product, usdRate, couponPen);

  return (
    <section aria-labelledby="destacada-title" className="relative isolate p-3 wide:p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 [background:linear-gradient(160deg,rgb(18_180_128/0.12),transparent_55%),rgb(2_12_8/0.85)] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent),linear-gradient(180deg,transparent,#000_12%,#000_86%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
      />
      <p className="mb-3 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.25em] text-white/80 wide:text-sm">
        <Icon name="sparkles" className="text-base text-primary" />
        {siteConfig.home.hero.featuredLabel}
      </p>

      <Link href={productPath(product.slug)} className="group block rounded-[1.6rem] outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-black/40 short:aspect-[16/10]">
          <SafeImage
            src={productCover(product)}
            alt={`${product.name} reacondicionada`}
            fill
            loading="eager"
            sizes="(min-width: 1600px) 30vw, (min-width: 1024px) 27rem, 90vw"
            className="object-cover brightness-[0.95] contrast-[1.06] saturate-[1.08] transition-transform duration-700 ease-out-strong group-hover:scale-[1.03]"
          />
          <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(2_12_8/0.7))]" />
          {coupon ? (
            <span
              aria-label={`Cupón de ${coupon} al reservar`}
              className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[linear-gradient(90deg,#ea580c,#f97316)] px-3 py-1.5 text-xs font-extrabold text-white shadow-[0_4px_14px_rgb(234_88_12/0.5)]"
            >
              <Icon name="deal" className="text-sm" /> -{coupon} al reservar
            </span>
          ) : null}
        </div>

        <div className="px-1 pt-4 short:pt-3">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-primary">{product.brand}</p>
          <h2
            id="destacada-title"
            className="mt-1.5 line-clamp-2 text-lg font-bold leading-snug text-white transition-colors duration-200 group-hover:text-primary short:text-base wide:text-xl"
          >
            {product.name}
          </h2>
          {specs.length ? <p className="mt-1.5 line-clamp-1 text-sm text-white/70">{specs.join(" · ")}</p> : null}

          <div className="mt-4 flex items-end justify-between gap-3 short:mt-3">
            <div>
              <p className="font-display text-3xl font-extrabold leading-none tracking-tight text-[#c8ffe9] wide:text-4xl">
                {formatPrice(product.price, product.currency)}
              </p>
              <p className={`mt-2 flex flex-wrap items-center gap-x-1.5 text-xs font-semibold ${status.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse motion-reduce:animate-none`} />
                {status.label}
                {usd ? <span className="font-normal text-white/45">· o {usd}</span> : null}
              </p>
            </div>
            <span className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-white/[0.08] px-4 text-sm font-bold text-white transition-colors duration-200 group-hover:bg-primary group-hover:text-on-primary">
              Ver laptop <Icon name="arrow" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
