"use client";

import Link from "next/link";
import { useEffect, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Product } from "@/lib/types/product";
import type { ActionState } from "@/app/admin/actions";
import { Field, Input, Textarea, Checkbox } from "@/components/ui/form";
import { Button, buttonClasses } from "@/components/ui/Button";

const initialState: ActionState = { ok: true };

type FormValues = Record<string, any>;

function getInitialValues(product?: Product): FormValues {
  const specsText = (product?.specs ?? []).map((spec) => `${spec.label}: ${spec.value}`).join("\n");
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    brand: product?.brand ?? "",
    price: String(product?.price ?? ""),
    originalPrice: String(product?.originalPrice ?? ""),
    currency: product?.currency ?? "PEN",
    conditionGrade: product?.conditionGrade ?? "REFURBISHED",
    processor: product?.processor ?? "",
    ram: product?.ram ?? "",
    storage: product?.storage ?? "",
    display: product?.display ?? "",
    batteryHealth: product?.batteryHealth ?? "",
    description: product?.description ?? "",
    verdict: product?.verdict ?? "",
    images: (product?.images ?? []).join("\n"),
    badges: (product?.badges ?? []).join("\n"),
    specs: specsText,
    stock: String(product?.stock ?? 0),
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
  };
}

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
  const [formValues, setFormValues] = useState<FormValues>(() => getInitialValues(product));
  const errors = state.fieldErrors ?? {};

  // Sync action-returned values back into local state on validation/server errors
  useEffect(() => {
    if (state.values) {
      setFormValues((prev) => ({ ...prev, ...state.values }));
    }
  }, [state.values]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form action={formAction} className="space-y-8">
      {state.error ? (
        <div className="rounded-2xl border border-error/40 bg-error/15 p-4 text-sm font-semibold text-error shadow-neo-sm">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Nombre" htmlFor="name" required error={errors["name"]}>
          <Input id="name" name="name" value={formValues.name ?? ""} onChange={handleChange} required />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Se autogenera del nombre si lo dejas vacío" error={errors["slug"]}>
          <Input id="slug" name="slug" value={formValues.slug ?? ""} onChange={handleChange} placeholder="thinkpad-t480" />
        </Field>
        <Field label="Marca" htmlFor="brand" required error={errors["brand"]}>
          <Input id="brand" name="brand" value={formValues.brand ?? ""} onChange={handleChange} required />
        </Field>
        <Field label="Condición / Grado" htmlFor="conditionGrade" error={errors["conditionGrade"]}>
          <Input id="conditionGrade" name="conditionGrade" value={formValues.conditionGrade ?? ""} onChange={handleChange} />
        </Field>
        <Field label="Precio (en soles)" htmlFor="price" hint="Precio de venta en S/. El equivalente en dólares se calcula solo." required error={errors["price"]}>
          <Input id="price" name="price" type="number" min="0" step="1" value={formValues.price ?? ""} onChange={handleChange} required />
        </Field>
        <Field label="Precio anterior (opcional)" htmlFor="originalPrice" error={errors["originalPrice"]}>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            min="0"
            step="1"
            value={formValues.originalPrice ?? ""}
            onChange={handleChange}
          />
        </Field>
        <Field label="Moneda" htmlFor="currency" hint="PEN (soles) por defecto. Usa USD para precios en dólares." error={errors["currency"]}>
          <Input id="currency" name="currency" value={formValues.currency ?? ""} onChange={handleChange} />
        </Field>
        <Field label="Stock" htmlFor="stock" error={errors["stock"]}>
          <Input id="stock" name="stock" type="number" min="0" step="1" value={formValues.stock ?? ""} onChange={handleChange} />
        </Field>
        <Field label="Procesador" htmlFor="processor">
          <Input id="processor" name="processor" value={formValues.processor ?? ""} onChange={handleChange} />
        </Field>
        <Field label="Memoria (RAM)" htmlFor="ram">
          <Input id="ram" name="ram" value={formValues.ram ?? ""} onChange={handleChange} />
        </Field>
        <Field label="Almacenamiento" htmlFor="storage">
          <Input id="storage" name="storage" value={formValues.storage ?? ""} onChange={handleChange} />
        </Field>
        <Field label="Pantalla" htmlFor="display">
          <Input id="display" name="display" value={formValues.display ?? ""} onChange={handleChange} />
        </Field>
        <Field label="Salud de batería" htmlFor="batteryHealth">
          <Input id="batteryHealth" name="batteryHealth" value={formValues.batteryHealth ?? ""} onChange={handleChange} />
        </Field>
      </div>

      <Field label="Descripción" htmlFor="description">
        <Textarea id="description" name="description" value={formValues.description ?? ""} onChange={handleChange} />
      </Field>
      <Field label="Veredicto (sección THE VERDICT)" htmlFor="verdict">
        <Textarea id="verdict" name="verdict" value={formValues.verdict ?? ""} onChange={handleChange} />
      </Field>
      <Field label="Imágenes — una URL por línea" htmlFor="images">
        <Textarea id="images" name="images" value={formValues.images ?? ""} onChange={handleChange} placeholder="https://…" />
      </Field>
      <Field label="Badges — uno por línea" htmlFor="badges">
        <Textarea id="badges" name="badges" value={formValues.badges ?? ""} onChange={handleChange} placeholder="BEST SELLER" rows={3} />
      </Field>
      <Field label="Specs extra — formato «Etiqueta: Valor», una por línea" htmlFor="specs">
        <Textarea id="specs" name="specs" value={formValues.specs ?? ""} onChange={handleChange} placeholder="GPU: NVIDIA RTX 3060" rows={3} />
      </Field>

      <div className="flex flex-wrap gap-8">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
          <Checkbox name="isActive" checked={formValues.isActive ?? true} onChange={handleChange} /> Activo (visible en tienda)
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
          <Checkbox name="isFeatured" checked={formValues.isFeatured ?? false} onChange={handleChange} /> Destacado
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-outline-variant/60 pt-6">
        <SubmitButton label={submitLabel} />
        <Link href="/admin" className={buttonClasses({ variant: "outline", size: "lg" })}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
