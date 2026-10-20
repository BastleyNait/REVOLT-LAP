import { isInTransit, type Product } from "@/lib/types/product";
import { buildWhatsappUrl } from "@/lib/services/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsappIcon } from "@/components/ui/Icon";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";
import { ReservationWhatsappLink } from "@/components/product/ReservationOffer";
import ClickSpark from "@/components/ClickSpark";
import { siteConfig } from "@/lib/config/site";

/**
 * The main "Pedir por WhatsApp" call to action on the product detail page (React Bits ClickSpark).
 * On an "en camino" laptop it must sit inside a ReservationProvider: with the
 * coupon check on, the same button turns into a reservation request.
 */
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
  const source = compact ? "producto_barra_movil" : "producto";
  const className = buttonClasses({
    variant: "primary",
    size: compact ? "md" : "xl",
    className: compact ? "min-h-12 shrink-0" : "min-h-16 w-full text-center",
  });
  const icon = <WhatsappIcon className={compact ? "text-xl" : "text-2xl"} />;

  return (
    <ClickSpark sparkColor="#12B480" sparkSize={12} sparkRadius={26} sparkCount={10} duration={450} className={compact ? "shrink-0" : "w-full"}>
      {isInTransit(product) ? (
        <ReservationWhatsappLink
          href={href}
          reserveHref={buildWhatsappUrl(product, { productUrl, reserve: true })}
          label={siteConfig.product.ctaLabel}
          reserveLabel={compact ? "Reservar con cupón" : "Reservar con mi cupón"}
          source={source}
          product={product.slug}
          className={className}
        >
          {icon}
        </ReservationWhatsappLink>
      ) : (
        <WhatsappLink href={href} source={source} product={product.slug} className={className}>
          {icon}
          {siteConfig.product.ctaLabel}
        </WhatsappLink>
      )}
    </ClickSpark>
  );
}
