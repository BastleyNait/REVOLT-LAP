"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { RESERVATION_COUPON_PEN } from "@/lib/types/product";
import { formatPrice } from "@/lib/utils/format";
import { Icon } from "@/components/ui/Icon";
import { WhatsappLink } from "@/components/analytics/WhatsappLink";
import { cn } from "@/lib/utils/cn";

/**
 * Cupón de reserva para laptops "en camino". Es opt-in, como el de Mercado
 * Libre: no se aplica hasta que se marca el check (o el toast lo activa), y el
 * botón de WhatsApp —el de la tarjeta y el de la barra móvil— cambia con él.
 */
const ReservationContext = createContext<{ reserved: boolean; setReserved: (value: boolean) => void } | null>(null);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reserved, setReserved] = useState(false);
  const value = useMemo(() => ({ reserved, setReserved }), [reserved]);
  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>;
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) throw new Error("ReservationOffer fuera de ReservationProvider");
  return context;
}

const coupon = formatPrice(RESERVATION_COUPON_PEN, "PEN");

/** El check de la ficha: "Reserva y llévate S/ 150 de cupón", con el precio final al marcarlo. */
export function ReservationCheck({ price, currency }: { price: number; currency: string }) {
  const { reserved, setReserved } = useReservation();
  const final = currency === "PEN" ? formatPrice(Math.max(price - RESERVATION_COUPON_PEN, 0), "PEN") : null;

  return (
    <label
      className={cn(
        "coupon-shine relative flex cursor-pointer items-start gap-3.5 overflow-hidden rounded-2xl border p-4 transition-colors duration-200",
        reserved ? "border-deal bg-deal/15" : "border-deal/50 bg-deal/[0.07] hover:border-deal",
      )}
    >
      <input
        type="checkbox"
        checked={reserved}
        onChange={(event) => setReserved(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-150",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-deal peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-transparent",
          reserved ? "border-deal bg-deal text-on-deal" : "border-deal/70 bg-transparent text-transparent",
        )}
      >
        <Icon name="check-plain" className="text-base" />
      </span>
      <span className="min-w-0 text-[0.9375rem] leading-snug">
        <span className="block text-base font-bold text-on-background">Reserva ahora y llévate {coupon} de cupón</span>
        <span className="mt-1 block text-on-surface-variant">
          {reserved && final ? (
            <>
              Tu precio con cupón: <strong className="font-bold text-deal">{final}</strong>. Lo confirmamos por WhatsApp.
            </>
          ) : (
            "Solo para laptops en camino: aparta la tuya antes de que llegue y el cupón se descuenta de tu compra."
          )}
        </span>
      </span>
    </label>
  );
}

/** El botón de WhatsApp: con el cupón activo pide la reserva en vez de la consulta normal. */
export function ReservationWhatsappLink({
  href,
  reserveHref,
  label,
  reserveLabel,
  source,
  product,
  className,
  children,
}: Pick<ComponentProps<"a">, "className" | "children"> & {
  href: string;
  reserveHref: string;
  label: string;
  reserveLabel: string;
  source: string;
  product: string;
}) {
  const { reserved } = useReservation();
  return (
    <WhatsappLink
      href={reserved ? reserveHref : href}
      source={reserved ? `${source}_reserva` : source}
      product={product}
      className={className}
    >
      {children}
      {reserved ? reserveLabel : label}
    </WhatsappLink>
  );
}

/** Aviso que aparece al entrar a una laptop en camino; "Activar mi cupón" marca el check. */
export function ReservationToast({ productSlug }: { productSlug: string }) {
  const { reserved, setReserved } = useReservation();
  const [open, setOpen] = useState(false);
  const storageKey = `reserva-toast:${productSlug}`;

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(storageKey) === "1";
    } catch {
      // sin sessionStorage (modo privado, bloqueado): se muestra igual
    }
    if (seen) return;
    const timer = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // idem
    }
  }, [storageKey]);

  // Se cierra solo a los 12 s: debe llamar la atención, no tapar la ficha.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(dismiss, 12000);
    return () => window.clearTimeout(timer);
  }, [open, dismiss]);

  if (!open || reserved) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      // En móvil queda sobre la barra de compra fija; en escritorio, abajo a la derecha.
      className="animate-toast fixed inset-x-4 bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] z-50 md:inset-x-auto md:bottom-8 md:right-8 md:w-[24rem]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-deal/60 bg-[#1a0f04] p-4 pr-11 shadow-[0_18px_50px_-12px_rgb(234_88_12/0.55)]">
        <div className="flex items-start gap-3">
          <span aria-hidden className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deal-strong text-xl text-on-deal">
            <Icon name="deal" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-extrabold leading-snug text-white">Reserva esta laptop y llévate {coupon} de cupón</p>
            <p className="mt-1 text-sm leading-snug text-on-surface-variant">
              Está en camino (todavía no está en stock). Aparta la tuya ahora y el cupón se descuenta de tu compra.
            </p>
            <button
              type="button"
              onClick={() => {
                setReserved(true);
                dismiss();
              }}
              className="mt-3 inline-flex min-h-10 items-center rounded-full bg-deal-strong px-4 text-sm font-bold text-on-deal transition-[transform,filter] duration-150 hover:brightness-110 active:scale-[0.97]"
            >
              Activar mi cupón
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar aviso"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/10 hover:text-white"
        >
          <Icon name="close" className="text-lg" />
        </button>
      </div>
    </div>
  );
}
