"use client";

import { useActionState, useState } from "react";
import { saveCouponAction, type CouponFormState } from "./actions";
import { buttonClasses } from "@/components/ui/Button";

export function CouponForm({ current, min, max }: { current: number; min: number; max: number }) {
  const [state, action, pending] = useActionState<CouponFormState, FormData>(saveCouponAction, { status: "idle" });
  const [value, setValue] = useState(String(current));
  const n = Number(value);
  const example = 1690;

  return (
    <form action={action} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold tracking-wide">Monto del cupón (soles)</span>
        <div className="flex max-w-xs items-center overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest/70 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/40">
          <span className="pl-4 font-semibold text-on-surface-variant">S/</span>
          <input
            name="couponPen"
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={1}
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-12 w-full bg-transparent px-3 text-lg font-bold focus:outline-none"
          />
        </div>
        <span className="mt-1.5 block text-xs text-on-surface-variant">Entre S/ {min} y S/ {max}.</span>
      </label>

      {Number.isFinite(n) && n >= min && n <= max ? (
        <p className="text-sm text-on-surface-variant">
          Ejemplo: una laptop en camino de S/ {example.toLocaleString("en-US")} se verá a{" "}
          <strong className="text-on-background">S/ {(example - n).toLocaleString("en-US")}</strong> con el cupón.
        </p>
      ) : null}

      {state.status !== "idle" ? (
        <p
          className={`rounded-2xl border p-3 text-sm font-semibold ${state.status === "ok" ? "border-primary/40 bg-primary/10 text-primary" : "border-error/40 bg-error/10 text-error"}`}
        >
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={buttonClasses({ variant: "primary", size: "md", className: "min-h-12 disabled:opacity-60" })}>
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
