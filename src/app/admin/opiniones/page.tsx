import { listReviewsForAdmin, reviewsEnabled } from "@/lib/repositories/reviews";
import { Stars } from "@/components/reviews/Stars";
import QRCode from "qrcode";
import { getAllProductsAdmin } from "@/lib/repositories/products";
import { requestOrigin, reviewLink } from "@/lib/repositories/reviews";
import { PastInviteForm } from "@/components/reviews/PastInviteForm";
import { InviteShare } from "@/components/reviews/InviteShare";
import { deleteReviewAction, toggleReviewAction } from "./actions";

export const dynamic = "force-dynamic";

const date = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Lima" }).format(new Date(iso));

/**
 * Admin list of review invites and reviews. Hiding is meant for spam or
 * insults — honest negative reviews are what make the positive ones credible.
 */
export default async function AdminReviewsPage() {
  const [rows, products, origin] = await Promise.all([
    listReviewsForAdmin(),
    getAllProductsAdmin().catch(() => []),
    requestOrigin(),
  ]);
  const laptops = Array.from(new Set(products.map((product) => product.name)));
  // Invitaciones sin usar: su enlace y QR siguen a mano para reenviarlos.
  const links = new Map(
    await Promise.all(
      rows
        .filter((row) => !row.submitted_at)
        .map(async (row) => {
          const url = reviewLink(row.token, origin);
          const qr = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 1 });
          return [row.id, { url, qr }] as const;
        }),
    ),
  );
  const submitted = rows.filter((r) => r.submitted_at);
  const pending = rows.length - submitted.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Opiniones</h1>
        <p className="mt-1 text-on-surface-variant">
          {submitted.length} publicadas o enviadas · {pending} invitaciones sin usar. Cada PDF de envío crea una invitación con QR único; para compras anteriores, genéralo aquí.
        </p>
      </div>

      {!reviewsEnabled ? (
        <p className="rounded-2xl border border-error/40 bg-error/10 p-4 text-sm">Supabase no está configurado en este entorno.</p>
      ) : null}

      {reviewsEnabled ? <PastInviteForm laptops={laptops} /> : null}

      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.id} className="glass flex flex-col gap-4 rounded-3xl p-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-bold">{row.customer_name}</span>
                <span className="text-xs text-on-surface-variant">
                  {row.order_code} · {row.laptop} {row.city ? `· ${row.city}` : ""}
                </span>
              </p>
              {row.submitted_at ? (
                <>
                  <div className="mt-2 flex items-center gap-3">
                    <Stars value={row.rating ?? 0} size="sm" />
                    <span className="text-xs text-on-surface-variant">
                      {date(row.submitted_at)} · como «{row.author_name}»
                    </span>
                  </div>
                  {row.comment ? <p className="mt-2 leading-relaxed">“{row.comment}”</p> : null}
                </>
              ) : (
                <>
                  <p className="mt-2 text-sm text-on-surface-variant">Invitación creada el {date(row.created_at)} · aún no opina</p>
                  {links.get(row.id) ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-semibold text-primary">Ver enlace y QR para reenviar</summary>
                      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div
                          aria-label="Código QR del enlace de opinión"
                          className="h-32 w-32 shrink-0 rounded-xl bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
                          dangerouslySetInnerHTML={{ __html: links.get(row.id)!.qr }}
                        />
                        <div className="min-w-0 space-y-3">
                          <p className="break-all text-sm text-on-surface-variant">{links.get(row.id)!.url.replace(/^https?:\/\//, "")}</p>
                          <InviteShare url={links.get(row.id)!.url} customerName={row.customer_name} laptop={row.laptop} />
                        </div>
                      </div>
                    </details>
                  ) : null}
                </>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {row.submitted_at ? (
                <>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${row.is_visible ? "bg-primary/15 text-primary" : "bg-white/10 text-on-surface-variant"}`}
                  >
                    {row.is_visible ? "Publicada" : "Oculta"}
                  </span>
                  <form action={toggleReviewAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="visible" value={String(!row.is_visible)} />
                    <button type="submit" className="min-h-10 rounded-full border border-white/15 px-4 text-sm font-semibold hover:bg-white/10">
                      {row.is_visible ? "Ocultar" : "Publicar"}
                    </button>
                  </form>
                </>
              ) : null}
              <form action={deleteReviewAction}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className="min-h-10 rounded-full px-4 text-sm font-semibold text-error hover:bg-error/10">
                  Eliminar
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      {!rows.length && reviewsEnabled ? <p className="text-on-surface-variant">Todavía no hay invitaciones. Genera un PDF en Envíos.</p> : null}
    </div>
  );
}
