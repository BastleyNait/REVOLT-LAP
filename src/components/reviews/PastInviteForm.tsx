"use client";

import { useActionState, useEffect, useRef } from "react";
import { createPastInviteAction, type PastInviteState } from "@/app/admin/opiniones/actions";
import { InviteShare } from "./InviteShare";

const field =
  "w-full rounded-xl border-2 border-outline-variant bg-surface p-3 text-base font-medium focus:border-primary focus:outline-none sm:text-sm";

/**
 * Invitar a opinar a un cliente de una compra anterior (sin PDF de envío):
 * genera su enlace único de un solo uso, con QR y mensaje de WhatsApp.
 */
export function PastInviteForm({ laptops }: { laptops: string[] }) {
  const [state, action, pending] = useActionState<PastInviteState, FormData>(createPastInviteAction, { status: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "ok") formRef.current?.reset();
  }, [state]);

  return (
    <section className="glass rounded-3xl p-5 md:p-6">
      <h2 className="text-xl font-extrabold">Invitar a un cliente anterior</h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        Para compras hechas antes de la app de Envíos: genera un enlace único para ese cliente (sirve una sola vez), con QR y mensaje de WhatsApp.
      </p>

      <form ref={formRef} action={action} className="mt-4 grid gap-3 md:grid-cols-[1.2fr_1.4fr_1fr_auto] md:items-end">
        <label className="grid gap-1.5 text-sm font-semibold">
          Cliente
          <input name="customerName" required maxLength={120} placeholder="Nombre y apellido" className={field} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Laptop
          <input name="laptop" list="past-invite-laptops" maxLength={160} placeholder="Ej. Lenovo ThinkPad T14" className={field} />
          <datalist id="past-invite-laptops">
            {laptops.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Ciudad
          <input name="city" maxLength={120} placeholder="Arequipa" className={field} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="min-h-12 rounded-full bg-primary px-6 font-semibold text-on-primary hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Generando…" : "Generar enlace"}
        </button>
      </form>

      {state.status === "error" ? (
        <p className="mt-4 rounded-2xl border border-error/40 bg-error/10 p-3 text-sm font-semibold text-error">{state.message}</p>
      ) : null}

      {state.status === "ok" ? (
        <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-primary/30 bg-primary/[0.06] p-4 sm:flex-row sm:items-center">
          <div
            aria-label="Código QR del enlace de opinión"
            className="h-40 w-40 shrink-0 rounded-xl bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: state.qrSvg }}
          />
          <div className="min-w-0 space-y-3">
            <p className="font-bold">
              Enlace de {state.customerName} <span className="text-xs font-semibold text-on-surface-variant">· {state.orderCode}</span>
            </p>
            <a href={state.url} target="_blank" rel="noreferrer" className="block break-all text-sm font-semibold text-primary underline underline-offset-2">
              {state.url.replace(/^https?:\/\//, "")}
            </a>
            <InviteShare url={state.url} customerName={state.customerName} laptop={state.laptop} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
