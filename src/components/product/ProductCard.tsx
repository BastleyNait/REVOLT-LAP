import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { productCover } from "@/lib/types/product";
import { SafeImage } from "@/components/ui/SafeImage";
import { discountPercent, formatPrice, formatUsdEquivalent } from "@/lib/utils/format";
import { conditionLabel, localizeLabel, withCapacityUnit } from "@/lib/utils/localize";
import { productPath } from "@/lib/seo/structured-data";
import { Icon } from "@/components/ui/Icon";
import SpotlightCard from "@/components/SpotlightCard";
import { StockStatus } from "./StockStatus";

/**
 * Frosted-glass catalogue card inside a React Bits SpotlightCard (a brand-green
 * light follows the mouse). The title link is "stretched" over the whole card,
 * so the card is one big tap target without nesting interactive elements.
 * Hover is a near-imperceptible lift (seen tens of times per visit).
 */
export function ProductCard({ product }: { product: Product }) {
  const href = productPath(product.slug);
  const discount = discountPercent(product.price, product.originalPrice);
  const usd = formatUsdEquivalent(product.price, product.currency);
  const specs = [
    product.processor && { icon: "cpu", value: localizeLabel(product.processor) },
    product.ram && { icon: "memory", value: withCapacityUnit(product.ram) },
    product.storage && { icon: "storage", value: withCapacityUnit(product.storage) },
  ].filter(Boolean) as { icon: string; value: string }[];

  return (
    <SpotlightCard
      spotlightColor="rgba(18, 180, 128, 0.18)"
      className="glass group h-full transition-[transform,border-color] duration-200 ease-out-strong hover:-translate-y-1 hover:border-primary/40 focus-within:border-primary/60"
    >
      <article className="flex h-full flex-col gap-4 p-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-surface-container">
          <SafeImage
            src={productCover(product)}
            alt={`${product.name} reacondicionada`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (min-width: 1921px) 20vw, 380px"
            className="object-cover transition-transform duration-300 ease-out-strong group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {conditionLabel(product.conditionGrade)}
            </span>
            {discount ? (
              <span className="rounded-full bg-deal-strong px-2.5 py-1 text-xs font-bold text-on-deal">-{discount}%</span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{product.brand}</p>
            <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-snug">
              <Link
                href={href}
                className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-primary"
              >
                {product.name}
              </Link>
            </h3>
          </div>

          {specs.length ? (
            <ul className="space-y-1.5 text-sm text-on-surface-variant">
              {specs.map((spec) => (
                <li key={spec.icon} className="flex items-center gap-2">
                  <Icon name={spec.icon} className="text-base text-primary/80" />
                  <span className="line-clamp-1">{spec.value}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4">
            <div>
              {product.originalPrice && discount ? (
                <p className="text-sm text-on-surface-variant line-through">{formatPrice(product.originalPrice, product.currency)}</p>
              ) : null}
              <p className="font-display text-[1.65rem] font-extrabold leading-none tracking-tight">
                {formatPrice(product.price, product.currency)}
              </p>
              {usd ? <p className="mt-1.5 text-sm text-on-surface-variant">o {usd}</p> : null}
            </div>
            <span
              aria-hidden
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5"
            >
              <Icon name="arrow" className="text-xl" />
            </span>
          </div>
          <StockStatus stock={product.stock} compact />
        </div>
      </article>
    </SpotlightCard>
  );
}
