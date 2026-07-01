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
          className={`rounded-2xl border p-4 text-sm font-semibold shadow-neo-sm ${
            isError ? "border-error/40 bg-error/15 text-error" : "border-primary/40 bg-primary/15 text-primary"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display-lg text-3xl font-black tracking-tight">
          Inventario ({products.length})
        </h1>
        <Link href="/admin/new" className={buttonClasses({ variant: "primary", size: "md" })}>
          <Icon name="add" /> Nuevo producto
        </Link>
      </div>

      <ProductTable products={products} />
    </div>
  );
}
