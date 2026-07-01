import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "../actions";

export const metadata = { title: "Nuevo producto" };

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display-lg text-3xl font-black tracking-tight">Nuevo producto</h1>
      <ProductForm action={createProductAction} submitLabel="Crear producto" />
    </div>
  );
}
