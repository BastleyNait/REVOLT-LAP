import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types/product";
import { productCover } from "@/lib/types/product";
import { formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { DeleteForm } from "./DeleteForm";
import { deleteProductAction } from "@/app/admin/actions";

export function ProductTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="border-thick border-on-background bg-surface-container-lowest p-10 text-center shadow-neo">
        <p className="font-label-mono text-body-md font-bold uppercase">
          No hay productos todavía. Crea el primero.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col gap-4 border-thick border-on-background bg-surface-container-lowest p-4 shadow-neo md:flex-row md:items-center"
        >
          <div className="relative h-16 w-24 shrink-0 border-thin border-on-background bg-on-background">
            <Image src={productCover(product)} alt={product.name} fill sizes="96px" className="object-cover" />
          </div>

          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-headline-lg-mobile text-lg font-black uppercase">{product.name}</h3>
              {!product.isActive ? <Badge color="dark">OCULTO</Badge> : null}
              {product.isFeatured ? <Badge color="orange">DESTACADO</Badge> : null}
            </div>
            <p className="mt-1 font-label-mono text-label-mono text-on-surface-variant">
              {product.brand} · /{product.slug} · stock {product.stock}
            </p>
          </div>

          <div className="font-display-lg text-2xl font-black">
            {formatPrice(product.price, product.currency)}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className={buttonClasses({ variant: "outline", size: "sm" })}
            >
              Ver
            </Link>
            <Link
              href={`/admin/${product.id}/edit`}
              className={buttonClasses({ variant: "primary", size: "sm" })}
            >
              Editar
            </Link>
            <DeleteForm id={product.id} name={product.name} action={deleteProductAction} />
          </div>
        </div>
      ))}
    </div>
  );
}
