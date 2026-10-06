"use client";

import Link from "next/link";
import { useEffect, useActionState, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { DEFAULT_CONDITION, type Product } from "@/lib/types/product";
import type { ActionState } from "@/app/admin/actions";
import { Field, Input, Textarea, Checkbox } from "@/components/ui/form";
import { Button, buttonClasses } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";
import { RichTextEditor } from "./RichTextEditor";

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
    conditionGrade: product?.conditionGrade ?? DEFAULT_CONDITION,
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

  // Image state — separate from formValues so the uploader manages its own list
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images ?? []);
  // Hidden input ref to write the final image URLs into the form before submit
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Sync action-returned values back into local state on validation/server errors
  useEffect(() => {
    if (state.values) {
      setFormValues((prev) => ({ ...prev, ...state.values }));
      // Also restore images from the error state
      const raw = state.values.images ?? "";
      if (typeof raw === "string" && raw) {
        setImageUrls(raw.split("\n").filter((l: string) => l.trim()));
      }
    }
  }, [state.values]);

  const setField = (name: string) => (value: string) => setFormValues((prev) => ({ ...prev, [name]: value }));

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
        <Field label="URL del producto (slug)" htmlFor="slug" hint="Se genera sola a partir del nombre si la dejas vacía. Ej.: /laptops/thinkpad-t480" error={errors["slug"]}>
          <Input id="slug" name="slug" value={formValues.slug ?? ""} onChange={handleChange} placeholder="thinkpad-t480" />
        </Field>
        <Field label="Marca" htmlFor="brand" required error={errors["brand"]}>
          <Input id="brand" name="brand" value={formValues.brand ?? ""} onChange={handleChange} required />
        </Field>
        <Field label="Estado del equipo" htmlFor="conditionGrade" hint="Ej.: Excelente estado, Buen estado, Grado A" error={errors["conditionGrade"]}>
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

      <Field
        label="Descripción"
        hint="Texto enriquecido: usa negritas, subtítulos, listas y enlaces. Indica aquí cualquier detalle que no esté al 100 %."
        error={errors["description"]}
      >
        <RichTextEditor
          id="description"
          label="Descripción"
          value={formValues.description ?? ""}
          onChange={setField("description")}
          placeholder="Para quién es ideal, qué incluye, estado de la batería…"
          invalid={Boolean(errors["description"])}
        />
        <input type="hidden" name="description" value={formValues.description ?? ""} />
      </Field>
      <Field label="Nuestra opinión (opcional)" hint="Se muestra como una sección destacada al final de la ficha." error={errors["verdict"]}>
        <RichTextEditor
          id="verdict"
          label="Nuestra opinión"
          value={formValues.verdict ?? ""}
          onChange={setField("verdict")}
          placeholder="Ej.: La mejor opción para universitarios que programan…"
        />
        <input type="hidden" name="verdict" value={formValues.verdict ?? ""} />
      </Field>

      {/* Image uploader — replaces the old textarea */}
      <Field label="Imágenes del producto" htmlFor="images-upload">
        <ImageUploader
          currentUrls={product?.images ?? []}
          onChange={setImageUrls}
        />
        {/* Hidden input — the form action reads this to get the final image URLs */}
        <input
          ref={imageInputRef}
          type="hidden"
          name="images"
          value={imageUrls.join("\n")}
        />
      </Field>

      <Field label="Etiquetas destacadas — una por línea" htmlFor="badges">
        <Textarea id="badges" name="badges" value={formValues.badges ?? ""} onChange={handleChange} placeholder="MÁS VENDIDA" rows={3} />
      </Field>
      <Field label="Especificaciones extra — formato «Etiqueta: Valor», una por línea" htmlFor="specs">
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
