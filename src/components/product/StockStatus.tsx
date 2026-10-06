import { cn } from "@/lib/utils/cn";

/** Availability line: in stock / last units (urgency) / sold out. */
export function StockStatus({ stock, compact = false }: { stock: number; compact?: boolean }) {
  const state =
    stock <= 0
      ? { label: "Agotada · consulta por pedido", dot: "bg-on-surface-variant", text: "text-on-surface-variant" }
      : stock <= 2
        ? { label: stock === 1 ? "Unidad única disponible" : `¡Últimas ${stock} unidades!`, dot: "bg-deal", text: "text-deal" }
        : { label: "Disponible · en stock", dot: "bg-primary", text: "text-primary" };

  return (
    <p className={cn("flex items-center gap-2 font-semibold", compact ? "text-sm" : "text-base", state.text)}>
      <span className={cn("h-2 w-2 rounded-full", state.dot, stock > 0 && "animate-pulse motion-reduce:animate-none")} />
      {state.label}
    </p>
  );
}
