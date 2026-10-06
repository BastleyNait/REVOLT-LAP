import { cn } from "@/lib/utils/cn";

/** Availability line: in stock / last units (urgency) / sold out. */
export function StockStatus({ stock, compact = false, pill = false }: { stock: number; compact?: boolean; pill?: boolean }) {
  const state =
    stock <= 0
      ? { label: "Agotada · consulta por pedido", dot: "bg-on-surface-variant", text: "text-on-surface-variant" }
      : stock <= 2
        ? { label: stock === 1 ? "Unidad única disponible" : `¡Últimas ${stock} unidades!`, dot: "bg-deal", text: "text-deal" }
        : { label: "Disponible · en stock", dot: "bg-primary", text: "text-primary" };

  return (
    <p className={cn("flex items-center gap-2 font-semibold", compact ? "text-sm" : "text-base", pill && "w-fit rounded-full border border-white/10 bg-black/30 px-3.5 py-1.5", state.text)}>
      <span className={cn("h-2 w-2 rounded-full", state.dot, stock > 0 && "animate-pulse motion-reduce:animate-none")} />
      {state.label}
    </p>
  );
}
