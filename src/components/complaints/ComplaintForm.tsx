"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { submitComplaintAction, type ComplaintFormState } from "@/app/libro-de-reclamaciones/actions";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const input =
  "w-full min-h-12 rounded-xl border border-white/12 bg-black/35 px-4 py-3 text-base text-on-background placeholder:text-on-surface-variant/50 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30";

function F({ label, children, className, req = true }: { label: string; children: ReactNode; className?: string; req?: boolean }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-semibold">
        {label}
        {req ? <span className="text-primary"> *</span> : <span className="font-normal text-on-surface-variant"> (opcional)</span>}
      </span>
      {children}
    </label>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="glass rounded-[1.75rem] p-5 md:p-7">
      <legend className="sr-only">{title}</legend>
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.25em] text-primary">{n}.</p>
      <h2 className="mb-5 text-lg font-bold">{title}</h2>
      {children}
    </fieldset>
  );
}

export function ComplaintForm() {
  const [state, action, pending] = useActionState<ComplaintFormState, FormData>(submitComplaintAction, { status: "idle" });
  const v = state.fields ?? {};
  const [minor, setMinor] = useState(v.is_minor === "on");
  const [kind, setKind] = useState(v.kind ?? "reclamo");

  return (
    <form action={action} className="space-y-6">
      <Section n={1} title="Identificación del consumidor reclamante">
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Nombre completo" className="sm:col-span-2">
            <input name="full_name" required defaultValue={v.full_name} autoComplete="name" className={input} />
          </F>
          <div className="grid grid-cols-[7rem_1fr] gap-2">
            <F label="Documento">
              <select name="doc_type" defaultValue={v.doc_type ?? "DNI"} className={input}>
                <option>DNI</option>
                <option value="CE">CE</option>
                <option>Pasaporte</option>
                <option>RUC</option>
              </select>
            </F>
            <F label="Número">
              <input name="doc_number" required defaultValue={v.doc_number} inputMode="numeric" className={input} />
            </F>
          </div>
          <F label="Teléfono">
            <input name="phone" required defaultValue={v.phone} type="tel" autoComplete="tel" className={input} />
          </F>
          <F label="Domicilio" className="sm:col-span-2">
            <input name="address" required defaultValue={v.address} autoComplete="street-address" className={input} />
          </F>
          <F label="Correo electrónico" className="sm:col-span-2">
            <input name="email" required defaultValue={v.email} type="email" autoComplete="email" className={input} />
          </F>
          <label className="flex items-center gap-3 sm:col-span-2">
            <input type="checkbox" name="is_minor" checked={minor} onChange={(e) => setMinor(e.target.checked)} className="h-5 w-5 accent-primary" />
            <span className="text-sm">Soy menor de edad</span>
          </label>
          {minor ? (
            <F label="Nombre del padre, madre o apoderado" className="sm:col-span-2">
              <input name="guardian_name" required defaultValue={v.guardian_name} className={input} />
            </F>
          ) : (
            <input type="hidden" name="guardian_name" value="" />
          )}
        </div>
      </Section>

      <Section n={2} title="Identificación del bien contratado">
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Tipo">
            <select name="item_type" defaultValue={v.item_type ?? "producto"} className={input}>
              <option value="producto">Producto</option>
              <option value="servicio">Servicio</option>
            </select>
          </F>
          <F label="Monto reclamado (S/)" req={false}>
            <input name="amount" defaultValue={v.amount} inputMode="decimal" placeholder="Ej.: 1690" className={input} />
          </F>
          <F label="Descripción" className="sm:col-span-2">
            <input name="item_description" required defaultValue={v.item_description} placeholder="Ej.: Laptop Lenovo ThinkPad X13" className={input} />
          </F>
          <F label="N.º de pedido o boleta" req={false} className="sm:col-span-2">
            <input name="order_code" defaultValue={v.order_code} placeholder="Ej.: REV-261110-5603 o B001-000123" className={input} />
          </F>
        </div>
      </Section>

      <Section n={3} title="Detalle de la reclamación y pedido del consumidor">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black/30 p-1.5">
          {(["reclamo", "queja"] as const).map((k) => (
            <label
              key={k}
              className={cn(
                "flex min-h-12 cursor-pointer items-center justify-center rounded-xl text-sm font-bold capitalize transition",
                kind === k ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-white/5",
              )}
            >
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
              {k}
            </label>
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          <strong className="text-on-background">Reclamo:</strong> disconformidad relacionada a los productos o servicios.{" "}
          <strong className="text-on-background">Queja:</strong> disconformidad no relacionada a los productos o servicios, o malestar
          o descontento respecto a la atención al público.
        </p>
        <div className="mt-5 grid gap-4">
          <F label="Detalle">
            <textarea name="detail" required rows={5} maxLength={2000} defaultValue={v.detail} className={cn(input, "resize-y")} />
          </F>
          <F label="Pedido">
            <textarea name="request" required rows={3} maxLength={1000} defaultValue={v.request} placeholder="¿Qué solución esperas?" className={cn(input, "resize-y")} />
          </F>
        </div>
      </Section>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-on-surface-variant">
        <input type="checkbox" name="accept" required className="mt-0.5 h-5 w-5 shrink-0 accent-primary" />
        Declaro que los datos consignados son correctos y autorizo su uso para la atención de esta hoja de reclamación.
      </label>

      {state.status === "error" ? (
        <p className="rounded-2xl border border-error/40 bg-error/10 p-3 text-sm font-semibold text-error">{state.message}</p>
      ) : null}

      <button type="submit" disabled={pending} className={buttonClasses({ variant: "primary", size: "lg", className: "min-h-14 w-full sm:w-auto disabled:opacity-60" })}>
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {pending ? "Enviando…" : "Enviar hoja de reclamación"}
      </button>
    </form>
  );
}
