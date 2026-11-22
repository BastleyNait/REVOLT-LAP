import Link from "next/link";
import { answerDeadline, complaintCode, complaintsEnabled, listComplaints } from "@/lib/repositories/complaints";
import { respondComplaintAction } from "./actions";

export const dynamic = "force-dynamic";

const day = (d: Date | string) =>
  new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Lima" }).format(new Date(d));

/** Admin inbox of the Libro de Reclamaciones, with the 15-business-day deadline. */
export default async function AdminComplaintsPage() {
  const rows = await listComplaints();
  const pending = rows.filter((r) => r.status === "pendiente");
  const now = Date.now();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Libro de Reclamaciones</h1>
        <p className="mt-1 text-on-surface-variant">
          {pending.length} pendientes · {rows.length} en total. Por ley debes responder en un plazo máximo de 15 días hábiles (al correo
          del consumidor; luego registra aquí tu respuesta).
        </p>
      </div>
      {!complaintsEnabled ? <p className="rounded-2xl border border-error/40 bg-error/10 p-4 text-sm">Supabase no está configurado.</p> : null}

      <ul className="space-y-4">
        {rows.map((r) => {
          const deadline = answerDeadline(r.created_at);
          const late = r.status === "pendiente" && deadline.getTime() < now;
          return (
            <li key={r.id} className="glass space-y-3 rounded-3xl p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-bold">{complaintCode(r)}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold uppercase">{r.kind}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${r.status === "respondido" ? "bg-primary/15 text-primary" : late ? "bg-error/15 text-error" : "bg-deal/15 text-deal"}`}
                >
                  {r.status === "respondido" ? "Respondido" : late ? `Vencido (${day(deadline)})` : `Responder antes del ${day(deadline)}`}
                </span>
                <span className="text-xs text-on-surface-variant">{day(r.created_at)}</span>
                <Link href={`/libro-de-reclamaciones/${r.id}`} target="_blank" className="ml-auto text-xs font-semibold text-primary underline">
                  Ver hoja
                </Link>
              </div>
              <p className="text-sm">
                <strong>{r.full_name}</strong> · {r.doc_type} {r.doc_number} · {r.phone} · {r.email}
              </p>
              <p className="text-sm text-on-surface-variant">
                {r.item_description}
                {r.order_code ? ` · ${r.order_code}` : ""}
                {r.amount != null ? ` · S/ ${r.amount}` : ""}
              </p>
              <p className="whitespace-pre-wrap text-sm">{r.detail}</p>
              <p className="whitespace-pre-wrap text-sm">
                <span className="font-semibold">Pide: </span>
                {r.request}
              </p>
              {r.status === "respondido" ? (
                <p className="whitespace-pre-wrap rounded-2xl border border-primary/30 p-3 text-sm">
                  <span className="font-semibold text-primary">Tu respuesta ({r.responded_at ? day(r.responded_at) : ""}): </span>
                  {r.response}
                </p>
              ) : (
                <form action={respondComplaintAction} className="space-y-2">
                  <input type="hidden" name="id" value={r.id} />
                  <textarea
                    name="response"
                    required
                    minLength={5}
                    rows={3}
                    placeholder="Respuesta enviada al consumidor"
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest/70 p-3 text-sm"
                  />
                  <button type="submit" className="min-h-10 rounded-full bg-primary px-5 text-sm font-bold text-on-primary">
                    Marcar como respondido
                  </button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
      {!rows.length && complaintsEnabled ? <p className="text-on-surface-variant">Aún no hay reclamos registrados.</p> : null}
    </div>
  );
}
