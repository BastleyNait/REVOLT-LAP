"use client";

import { useActionState, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { createLocalInviteAction, type LocalInviteState } from "@/app/admin/opiniones/actions";
import { InviteShare } from "./InviteShare";

const field =
  "w-full min-h-12 rounded-xl border border-outline-variant bg-surface-container-lowest/70 px-4 text-base focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30";

export interface LaptopOption {
  name: string;
  detail: string;
}

/** Admin form: pick the sold laptop + customer → one-time review link with QR. */
export function LocalInviteForm({ laptops }: { laptops: LaptopOption[] }) {
  const [state, action, pending] = useActionState<LocalInviteState, FormData>(createLocalInviteAction, { status: "idle" });
  const [picked, setPicked] = useState("");
  const [key, setKey] = useState(0);

  if (state.status === "ok" && state.url && key === 0) {
    return (
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          aria-label="Código QR del enlace de opinión"
          className="h-44 w-44 shrink-0 rounded-xl bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: state.qrSvg ?? "" }}
        />
        <div className="min-w-0 space-y-3">
          <p className="text-sm font-semibold text-primary">Enlace listo · solo para {state.customerName}</p>
          <p className="text-sm text-on-surface-variant">
            {state.laptop}. Si está contigo, que escanee el QR; si no, mándaselo por WhatsApp. Sirve una sola vez.
          </p>
          <a href={state.url} target="_blank" rel="noreferrer" className="block break-all text-sm font-semibold text-primary underline underline-offset-2">
            {state.url.replace(/^https?:\/\//, "")}
          </a>
          <InviteShare url={state.url} customerName={state.customerName ?? ""} laptop={state.laptop ?? ""} />
          <button
            type="button"
            onClick={() => {
              setKey(1);
              setPicked("");
            }}
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-background"
          >
            <RotateCcw className="h-4 w-4" /> Crear otro enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      action={(fd) => {
        setKey(0);
        return action(fd);
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <label className="block sm:col-span-2">
        <span className="mb-2 block text-sm font-semibold">Laptop vendida *</span>
        <select name="laptop" required value={picked} onChange={(e) => setPicked(e.target.value)} className={field}>
          <option value="" disabled>
            Elige del catálogo…
          </option>
          {laptops.map((l, i) => (
            <option key={`${l.name}-${i}`} value={l.name}>
              {l.name} — {l.detail}
            </option>
          ))}
          <option value="__other__">Otra (no está en el catálogo)</option>
        </select>
      </label>
      {picked === "__other__" ? (
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold">Nombre de la laptop *</span>
          <input name="laptopOther" required placeholder="Ej.: Lenovo ThinkPad T480 · i5 · 16GB" className={field} />
        </label>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Nombre del cliente *</span>
        <input name="customerName" required placeholder="Ej.: Carlos Mamani" autoComplete="off" className={field} />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Ciudad o distrito</span>
        <input name="city" defaultValue="Arequipa" className={field} />
      </label>
      {state.status === "error" ? <p className="text-sm font-semibold text-error sm:col-span-2">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-primary px-6 font-bold text-on-primary transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        Crear enlace de opinión
      </button>
    </form>
  );
}
