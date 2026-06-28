import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { productCover } from "@/lib/types/product";
import { discountPercent, formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const accents = ["bg-primary-container", "bg-surface-container-lowest", "bg-tertiary-container"];

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const href = `/products/${product.slug}`;
  const accent = accents[index % accents.length];
  const discount = discountPercent(product.price, product.originalPrice);
  const chips = [product.ram, product.storage].filter(Boolean) as string[];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-6 border-thick border-on-background p-6 shadow-neo-lg transition-all hover:-translate-x-2 hover:-translate-y-2 hover:shadow-neo-xl",
        accent,
      )}
    >
      {product.badges[0] ? (
        <div className="absolute -left-3 -top-3 z-10 -rotate-6">
          <Badge color="lavender">{product.badges[0]}</Badge>
        </div>
      ) : null}
      {discount ? (
        <div className="absolute -right-3 -top-3 z-10 rotate-6">
          <Badge color="danger">-{discount}%</Badge>
        </div>
      ) : null}

      <Link href={href} aria-label={product.name} className="block">
        <div className="relative aspect-[4/3] overflow-hidden border-thick border-on-background bg-on-background">
          <Image
            src={productCover(product)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover contrast-125 transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="flex flex-grow flex-col gap-4 border-thick border-on-background bg-surface-container-lowest p-4">
        {chips.length ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Badge key={chip} color="orange">
                {chip}
              </Badge>
            ))}
          </div>
        ) : null}
        <Link href={href}>
          <h3 className="font-headline-lg text-headline-lg-mobile font-black uppercase leading-none break-words hover:underline">
            {product.name}
          </h3>
        </Link>
        {product.processor ? (
          <p className="inline-block self-start bg-on-background px-2 font-body-lg text-body-md font-bold text-surface">
            {product.processor}
          </p>
        ) : null}
      </div>

      <div className="relative z-10 -mt-2 flex items-center justify-between gap-3 border-thick border-on-background bg-surface-container-lowest p-4">
        <div className="flex flex-col">
          {product.originalPrice ? (
            <span className="font-label-mono text-label-mono text-on-surface-variant line-through">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          ) : null}
          <span className="font-display-lg text-[40px] font-black leading-none">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
        <Link href={href} className={buttonClasses({ variant: "secondary", size: "md" })}>
          GO <Icon name="arrow_forward" />
        </Link>
      </div>
    </article>
  );
}
