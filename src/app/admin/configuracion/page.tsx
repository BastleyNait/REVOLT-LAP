import { COUPON_MAX, COUPON_MIN, DEFAULT_COUPON_PEN, getCouponSetting } from "@/lib/repositories/settings";
import { CouponForm } from "./CouponForm";

export const dynamic = "force-dynamic";

const date = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Lima" }).format(new Date(iso));

/** Store settings: the reservation coupon for laptops "en camino". */
export default async function AdminSettingsPage() {
  const coupon = await getCouponSetting();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Configuración</h1>
        <p className="mt-1 text-on-surface-variant">Valores de la tienda que puedes cambiar sin tocar el código.</p>
      </div>

      <section className="glass space-y-5 rounded-3xl p-6 md:p-8">
        <div>
          <h2 className="text-xl font-bold">Cupón de reserva</h2>
          <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
            Descuento para quien reserva una laptop <strong className="text-on-background">en camino</strong>. Se muestra en las tarjetas, en
            la ficha, en el aviso de la página de inicio y en el mensaje de WhatsApp. Los cambios se ven en la tienda en segundos.
          </p>
        </div>

        {coupon.error && coupon.source === "default" ? (
          <p className="rounded-2xl border border-error/40 bg-error/10 p-3 text-sm">
            Todavía no se puede guardar: ejecuta <code className="font-mono">supabase/settings.sql</code> en Supabase (SQL Editor). Mientras tanto
            la tienda usa S/ {DEFAULT_COUPON_PEN}.
          </p>
        ) : null}

        <p className="text-sm text-on-surface-variant">
          Valor actual: <strong className="text-on-background">S/ {coupon.value}</strong>
          {coupon.updatedAt ? ` · cambiado el ${date(coupon.updatedAt)}` : " · valor por defecto"}
        </p>

        <CouponForm current={coupon.value} min={COUPON_MIN} max={COUPON_MAX} />
      </section>
    </div>
  );
}
