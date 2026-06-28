import { notFound } from "next/navigation";
import { getProductById } from "@/lib/repositories/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProductAction } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar producto" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  // Bind the product id so the form action keeps the (prevState, formData) shape.
  const action = updateProductAction.bind(null, product.id);

  return (
    <div className="space-y-8">
      <h1 className="inline-block -rotate-1 bg-on-background px-4 py-2 font-display-lg text-headline-lg-mobile font-black uppercase text-surface">
        Editar: {product.name}
      </h1>
      <ProductForm action={action} product={product} submitLabel="Guardar cambios" />
    </div>
  );
}
