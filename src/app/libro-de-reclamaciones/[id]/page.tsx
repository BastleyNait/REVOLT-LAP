import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config/site";
import { answerDeadline, complaintCode, getComplaint } from "@/lib/repositories/complaints";
import { BookIcon } from "@/components/complaints/BookIcon";
import { PrintButton } from "@/components/complaints/PrintButton";
import { buttonClasses } from "@/components/ui/Button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Hoja de reclamación registrada", robots: { index: false, follow: false } };

const long = (d: Date | string) =>
  new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Lima" }).format(new Date(d));
const day = (d: Date) => new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Lima" }).format(d);

/**
 * Confirmation of a submitted sheet. The URL carries a random UUID, so only the
 * consumer who submitted it (or someone they share it with) can open it.
 */
export default async function ComplaintReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getComplaint(id);
  if (!c) notFound();
  const { business, legalName, whatsapp } = siteConfig;

  const rows: [string, string][] = [
    ["Tipo", c.kind === "reclamo" ? "Reclamo" : "Queja"],
    ["Consumidor", c.full_name],
    ["Documento", `${c.doc_type} ${c.doc_number}`],
    ["Domicilio", c.address],
    ["Teléfono", c.phone],
    ["Correo", c.email],
    ...(c.is_minor && c.guardian_name ? ([["Padre, madre o apoderado", c.guardian_name]] as [string, string][]) : []),
    ["Bien contratado", `${c.item_type === "producto" ? "Producto" : "Servicio"}: ${c.item_description}`],
    ...(c.amount != null ? ([["Monto reclamado", `S/ ${c.amount}`]] as [string, string][]) : []),
    ...(c.order_code ? ([["Pedido o boleta", c.order_code]] as [string, string][]) : []),
    ["Detalle", c.detail],
    ["Pedido", c.request],
  ];

  return (
    <main className="relative flex-1">
      <div className="mx-auto max-w-3xl space-y-6 px-4 pb-20 pt-10 md:pt-16 print:max-w-none print:p-0 print:text-black">
        <div className="glass rounded-[1.75rem] p-6 md:p-8 print:border-0 print:bg-white print:shadow-none">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary print:hidden">
              <BookIcon className="h-7 w-7" />
            </span>
            <div>
              <p className="text-sm font-semibold text-primary">Hoja registrada</p>
              <h1 className="text-2xl font-extrabold md:text-3xl">{complaintCode(c)}</h1>
              <p className="mt-1 text-sm text-on-surface-variant print:text-black">{long(c.created_at)}</p>
            </div>
          </div>

          <p className="mt-5 rounded-2xl bg-primary/10 p-4 text-sm leading-relaxed print:bg-white print:p-0">
            Te responderemos al correo <strong>{c.email}</strong> a más tardar el <strong>{day(answerDeadline(c.created_at))}</strong> (15
            días hábiles). Guarda o imprime esta hoja como constancia.
          </p>

          <p className="mt-5 text-sm text-on-surface-variant print:text-black">
            Proveedor: {legalName}
            {business.ruc ? ` · RUC ${business.ruc}` : ""} · {business.fiscalAddress || `${business.city}, ${business.countryName}`}
          </p>

          <dl className="mt-4 divide-y divide-white/10 print:divide-black/20">
            {rows.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-2.5 text-sm sm:grid-cols-[11rem_1fr]">
                <dt className="font-semibold text-on-surface-variant print:text-black">{k}</dt>
                <dd className="whitespace-pre-wrap break-words">{v}</dd>
              </div>
            ))}
          </dl>
          {c.status === "respondido" && c.response ? (
            <div className="mt-5 rounded-2xl border border-primary/30 p-4 text-sm">
              <p className="font-semibold text-primary">Respuesta del proveedor{c.responded_at ? ` · ${long(c.responded_at)}` : ""}</p>
              <p className="mt-2 whitespace-pre-wrap">{c.response}</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3 print:hidden">
          <PrintButton />
          <Link href="/" className={buttonClasses({ variant: "outline", size: "md", className: "min-h-12" })}>
            Volver a la tienda
          </Link>
        </div>
        <p className="text-xs text-on-surface-variant print:hidden">
          ¿Dudas sobre tu reclamo? Escríbenos al {whatsapp.display} indicando el código {complaintCode(c)}.
        </p>
      </div>
    </main>
  );
}
