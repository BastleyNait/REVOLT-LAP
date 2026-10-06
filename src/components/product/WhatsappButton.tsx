import type { Product } from "@/lib/types/product";
import { buildWhatsappUrl } from "@/lib/services/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsappIcon } from "@/components/ui/Icon";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";
import ClickSpark from "@/components/ClickSpark";
import { siteConfig } from "@/lib/config/site";

/** The main "Pedir por WhatsApp" call to action on the product detail page (React Bits ClickSpark). */
export function WhatsappOrderButton({
  product,
  productUrl,
  compact = false,
}: {
  product: Product;
  productUrl: string;
  compact?: boolean;
}) {
  const href = buildWhatsappUrl(product, { productUrl });

  return (
    <ClickSpark sparkColor="#12B480" sparkSize={12} sparkRadius={26} sparkCount={10} duration={450} className={compact ? "shrink-0" : "w-full"}>
      <WhatsappLink
        href={href}
        source={compact ? "producto_barra_movil" : "producto"}
        product={product.slug}
        className={buttonClasses({
          variant: "primary",
          size: compact ? "md" : "xl",
          className: compact ? "min-h-12 shrink-0" : "min-h-16 w-full text-center",
        })}
      >
        <WhatsappIcon className={compact ? "text-xl" : "text-2xl"} />
        {siteConfig.product.ctaLabel}
      </WhatsappLink>
    </ClickSpark>
  );
}
