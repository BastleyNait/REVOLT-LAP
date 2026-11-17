import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

/**
 * Orange "ticket" chip announcing the reservation coupon of an in-transit
 * laptop. Shared by the catalogue cards and the hero carousel. `amount` is the
 * formatted coupon (e.g. "S/ 100"). Tilts back to straight when an ancestor
 * has the `group` class and is hovered.
 */
export function CouponTag({ amount, className }: { amount: string; className?: string }) {
  return (
    <div
      aria-label={`Cupón de ${amount} al reservar`}
      className={cn(
        "coupon-tag coupon-shine relative flex shrink-0 -rotate-3 items-stretch overflow-hidden text-white drop-shadow-[0_6px_14px_rgb(234_88_12/0.45)] transition-transform duration-200 ease-out-strong group-hover:rotate-0",
        className,
      )}
    >
      <span className="flex flex-col items-center justify-center gap-0.5 bg-black/20 px-2 text-[0.6rem] font-extrabold uppercase tracking-[0.18em]">
        <Icon name="deal" className="text-base" />
        Cupón
      </span>
      <span className="coupon-tag__tear" aria-hidden />
      <span className="flex flex-col justify-center px-3 py-1.5 leading-none">
        <span className="font-display text-[1.6rem] font-extrabold tracking-tight">-{amount}</span>
        <span className="mt-1 text-[0.65rem] font-bold uppercase tracking-wider text-white/85">al reservar</span>
      </span>
    </div>
  );
}
