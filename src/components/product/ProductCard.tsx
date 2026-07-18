import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { productCover } from "@/lib/types/product";
import { discountPercent, formatPrice, formatUsdEquivalent } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export function ProductCard({ product }: { product: Product; index?: number }) {
  const href = `/products/${product.slug}`;
  const discount = discountPercent(product.price, product.originalPrice);
  const chips = [product.ram, product.storage].filter(Boolean) as string[];
  const usd = formatUsdEquivalent(product.price, product.currency);

  return (
    <article className="group glass flex h-full flex-col gap-4 rounded-3xl p-5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-surface/60 dark:hover:bg-surface/20" style={{ perspective: "1000px" }}>
      <div className="relative transform-style-3d transition-transform duration-500 group-hover:rotate-x-2 group-hover:-rotate-y-2">
        {product.badges[0] ? (
          <div className="absolute left-3 top-3 z-10 transform translate-z-[20px]">
            <Badge color="lavender">{product.badges[0]}</Badge>
          </div>
        ) : null}
        {discount ? (
          <div className="absolute right-3 top-3 z-10 transform translate-z-[20px]">
            <Badge color="danger">-{discount}%</Badge>
          </div>
        ) : null}

        <Link href={href} aria-label={product.name} className="block group/link">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-container before:absolute before:inset-0 before:z-10 before:rounded-2xl before:bg-gradient-to-t before:from-black/40 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all duration-500">
            <Image
              src={productCover(product)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
            />
            {/* Glow overlay */}
            <div className="absolute inset-0 z-20 bg-primary/20 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </Link>
      </div>

      <div className="flex flex-grow flex-col gap-3 transform transition-transform duration-500 group-hover:translate-z-[10px]">
        {chips.length ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Badge key={chip} color="aqua" className="shadow-sm">
                {chip}
              </Badge>
            ))}
          </div>
        ) : null}
        <Link href={href}>
          <h3 className="font-display-lg text-2xl font-extrabold leading-tight tracking-tight transition-colors duration-300 hover:text-primary group-hover:drop-shadow-sm">
            {product.name}
          </h3>
        </Link>
        {product.processor ? (
          <p className="text-sm text-on-surface-variant font-medium">{product.processor}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-outline-variant/30 pt-4 transform transition-all duration-500 group-hover:border-primary/30">
        <div className="flex flex-col">
          {product.originalPrice ? (
            <span className="text-sm text-on-surface-variant line-through opacity-70">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          ) : null}
          <span className="font-display-lg text-3xl font-black leading-none tracking-tight group-hover:text-primary transition-colors duration-300">
            {formatPrice(product.price, product.currency)}
          </span>
          {usd ? (
            <span className="text-xs font-medium text-on-surface-variant">o {usd}</span>
          ) : null}
        </div>
        <Link href={href} className={cn(buttonClasses({ variant: "primary", size: "sm" }), "transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)]")}>
          Ver <Icon name="arrow_forward" className="text-lg ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
