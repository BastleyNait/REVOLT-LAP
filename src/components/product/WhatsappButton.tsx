import type { Product } from "@/lib/types/product";
import { buildWhatsappUrl } from "@/lib/services/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/config/site";

/** The giant "PEDIR POR WHATSAPP" call-to-action on the product detail page. */
export function WhatsappOrderButton({
  product,
  productUrl,
}: {
  product: Product;
  productUrl: string;
}) {
  const href = buildWhatsappUrl(product, { productUrl });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses({
        variant: "primary",
        size: "xl",
        className: "w-full text-center",
      })}
    >
      <span className="font-display-lg">{siteConfig.product.ctaLabel}</span>
      <Icon name="forum" className="text-3xl" />
    </a>
  );
}
