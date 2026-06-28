"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Product } from "@/lib/types/product";
import type { ActionState } from "@/app/admin/actions";
import { Field, Input, Textarea, Checkbox } from "@/components/ui/form";
import { Button, buttonClasses } from "@/components/ui/Button";

const initialState: ActionState = { ok: true };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" disabled={pending}>
      {pending ? "Guardando…" : label}
    </Button>
  );
}

export function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  product?: Product;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};
  const specsText = (product?.specs ?? []).map((spec) => `${spec.label}: ${spec.value}`).join("\n");

  return (
    <form action={formAction} className="space-y-8">
      {state.error ? (
        <div className="border-thick border-on-background bg-error p-4 font-label-mono text-body-md font-bold text-on-error shadow-neo">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Nombre" htmlFor="name" required error={errors["name"]}>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Se autogenera del nombre si lo dejas vacío" error={errors["slug"]}>
          <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="thinkpad-t480" />
        </Field>
        <Field label="Marca" htmlFor="brand" required error={errors["brand"]}>
          <Input id="brand" name="brand" defaultValue={product?.brand} required />
        </Field>
        <Field label="Condición / Grado" htmlFor="conditionGrade" error={errors["conditionGrade"]}>
          <Input id="conditionGrade" name="conditionGrade" defaultValue={product?.conditionGrade ?? "REFURBISHED"} />
        </Field>
        <Field label="Precio" htmlFor="price" required error={errors["price"]}>
          <Input id="price" name="price" type="number" min="0" step="1" defaultValue={product?.price} required />
        </Field>
        <Field label="Precio anterior (opcional)" htmlFor="originalPrice" error={errors["originalPrice"]}>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.originalPrice ?? ""}
          />
        </Field>
        <Field label="Moneda" htmlFor="currency" error={errors["currency"]}>
          <Input id="currency" name="currency" defaultValue={product?.currency ?? "USD"} />
        </Field>
        <Field label="Stock" htmlFor="stock" error={errors["stock"]}>
          <Input id="stock" name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? 0} />
        </Field>
        <Field label="Procesador" htmlFor="processor">
          <Input id="processor" name="processor" defaultValue={product?.processor ?? ""} />
        </Field>
        <Field label="Memoria (RAM)" htmlFor="ram">
          <Input id="ram" name="ram" defaultValue={product?.ram ?? ""} />
        </Field>
        <Field label="Almacenamiento" htmlFor="storage">
          <Input id="storage" name="storage" defaultValue={product?.storage ?? ""} />
        </Field>
        <Field label="Pantalla" htmlFor="display">
          <Input id="display" name="display" defaultValue={product?.display ?? ""} />
        </Field>
        <Field label="Salud de batería" htmlFor="batteryHealth">
          <Input id="batteryHealth" name="batteryHealth" defaultValue={product?.batteryHealth ?? ""} />
        </Field>
      </div>

      <Field label="Descripción" htmlFor="description">
        <Textarea id="description" name="description" defaultValue={product?.description ?? ""} />
      </Field>
      <Field label="Veredicto (sección THE VERDICT)" htmlFor="verdict">
        <Textarea id="verdict" name="verdict" defaultValue={product?.verdict ?? ""} />
      </Field>
      <Field label="Imágenes — una URL por línea" htmlFor="images">
        <Textarea id="images" name="images" defaultValue={(product?.images ?? []).join("\n")} placeholder="https://…" />
      </Field>
      <Field label="Badges — uno por línea" htmlFor="badges">
        <Textarea id="badges" name="badges" defaultValue={(product?.badges ?? []).join("\n")} placeholder="BEST SELLER" rows={3} />
      </Field>
      <Field label="Specs extra — formato «Etiqueta: Valor», una por línea" htmlFor="specs">
        <Textarea id="specs" name="specs" defaultValue={specsText} placeholder="GPU: NVIDIA RTX 3060" rows={3} />
      </Field>

      <div className="flex flex-wrap gap-8">
        <label className="flex cursor-pointer items-center gap-3 font-label-mono text-label-mono font-bold uppercase">
          <Checkbox name="isActive" defaultChecked={product?.isActive ?? true} /> Activo (visible en tienda)
        </label>
        <label className="flex cursor-pointer items-center gap-3 font-label-mono text-label-mono font-bold uppercase">
          <Checkbox name="isFeatured" defaultChecked={product?.isFeatured ?? false} /> Destacado
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t-thick border-on-background pt-6">
        <SubmitButton label={submitLabel} />
        <Link href="/admin" className={buttonClasses({ variant: "outline", size: "lg" })}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
