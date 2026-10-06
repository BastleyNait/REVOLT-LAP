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
import { CardLightRays } from "./CardLightRays";

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

  const cover = productCover(product);

  return (
    <SpotlightCard
      spotlightColor="rgba(18, 180, 128, 0.18)"
      className="group h-full rounded-[2rem] border border-primary/15 bg-[#050807] shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)] transition-[transform,border-color] duration-200 ease-out-strong hover:-translate-y-1 hover:border-primary/40 focus-within:border-primary/60"
    >
      {/* Ambient glow: the same photo, enlarged, darkened and blurred, behind the laptop. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-3/5 overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <SafeImage src={cover} alt="" fill sizes="64px" className="scale-150 object-cover opacity-40 blur-3xl brightness-[0.3] saturate-150" />
      </div>

      <CardLightRays uid={product.id} />

      <article className="relative flex h-full flex-col">
        {/*
         * Photo melts into the card: a radial mask keeps the laptop in focus
         * and dissolves the light table/wall around it into the black card.
         */}
        <div className="relative aspect-[4/3] [-webkit-mask-composite:source-in] [mask-composite:intersect] [mask-image:radial-gradient(ellipse_58%_60%_at_50%_46%,black_38%,transparent_100%),linear-gradient(to_bottom,black_55%,transparent_96%)]">
          <SafeImage
            src={cover}
            alt={`${product.name} reacondicionada`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (min-width: 1921px) 20vw, 380px"
            className="scale-[0.94] object-cover brightness-[0.85] contrast-[1.15] saturate-[1.15] transition-transform duration-500 ease-out-strong group-hover:scale-[0.98]"
          />
        </div>
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-black/50 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
            <span aria-hidden className="h-2 w-2 rounded-full bg-primary" />
            {conditionLabel(product.conditionGrade)}
          </span>
          {discount ? (
            <span className="rounded-full bg-deal-strong px-2.5 py-1 text-xs font-bold text-on-deal">-{discount}%</span>
          ) : null}
        </div>

        <div className="-mt-3 flex flex-1 flex-col gap-4 px-6 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{product.brand}</p>
            <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-snug transition-colors duration-200 group-hover:text-primary">
              <Link
                href={href}
                className="outline-none after:absolute after:inset-0 after:rounded-[2rem] after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-primary"
              >
                {product.name}
              </Link>
            </h3>
          </div>

          {specs.length ? (
            <ul className="space-y-2 text-[0.9375rem] text-on-surface-variant">
              {specs.map((spec) => (
                <li key={spec.icon} className="flex items-center gap-3">
                  <Icon name={spec.icon} className="text-lg text-primary" />
                  <span className="line-clamp-1">{spec.value}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-auto space-y-3 border-t border-white/[0.08] pt-5">
            <div>
              <p className="font-display text-[2rem] font-extrabold leading-none tracking-tight text-[#c8ffe9]">
                {formatPrice(product.price, product.currency)}
              </p>
              {product.originalPrice && discount ? (
                <p className="mt-1.5 text-sm text-on-surface-variant line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </p>
              ) : null}
              {usd ? <p className="mt-1 text-sm text-on-surface-variant">o {usd}</p> : null}
            </div>
            <StockStatus stock={product.stock} compact pill />
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
