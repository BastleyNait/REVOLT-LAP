import Link from "next/link";
import { getAllProductsAdmin } from "@/lib/repositories/products";
import { ProductTable } from "@/components/admin/ProductTable";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

const STATUS_MESSAGES: Record<string, string> = {
  created: "Producto creado correctamente.",
  updated: "Producto actualizado correctamente.",
  deleted: "Producto eliminado.",
  "delete-error": "No se pudo eliminar el producto.",
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [products, { status }] = await Promise.all([getAllProductsAdmin(), searchParams]);
  const message = status ? STATUS_MESSAGES[status] : undefined;
  const isError = status === "delete-error";

  return (
    <div className="space-y-8">
      <AdminNotice />

      {message ? (
        <div
          className={`border-thick border-on-background p-4 font-label-mono text-label-mono font-bold uppercase shadow-neo ${
            isError ? "bg-error text-on-error" : "bg-primary-container text-on-container"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display-lg text-headline-lg-mobile font-black uppercase">
          Inventario ({products.length})
        </h1>
        <Link href="/admin/new" className={buttonClasses({ variant: "secondary", size: "md" })}>
          <Icon name="add" /> Nuevo producto
        </Link>
      </div>

      <ProductTable products={products} />
    </div>
  );
}
