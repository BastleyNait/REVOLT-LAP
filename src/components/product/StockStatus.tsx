import { cn } from "@/lib/utils/cn";
import { IN_TRANSIT_ETA } from "@/lib/types/product";

/** Availability line: in transit / in stock / last units (urgency) / sold out. */
export function StockStatus({
  stock,
  inTransit = false,
  compact = false,
  pill = false,
}: {
  stock: number;
  inTransit?: boolean;
  compact?: boolean;
  pill?: boolean;
}) {
  // "En camino" wins over the stock count: the unit exists but is not in Peru yet.
  const state = inTransit
    ? { label: `En camino · ${IN_TRANSIT_ETA.charAt(0).toLowerCase()}${IN_TRANSIT_ETA.slice(1)}`, dot: "bg-deal", text: "text-deal" }
    : stock <= 0
      ? { label: "Agotada · consulta por pedido", dot: "bg-on-surface-variant", text: "text-on-surface-variant" }
      : stock <= 2
        ? { label: stock === 1 ? "Unidad única disponible" : `¡Últimas ${stock} unidades!`, dot: "bg-deal", text: "text-deal" }
        : { label: "Disponible · en stock", dot: "bg-primary", text: "text-primary" };

  return (
    <p className={cn("flex items-center gap-2 font-semibold", compact ? "text-sm" : "text-base", pill && "w-fit rounded-full border border-white/10 bg-black/30 px-3.5 py-1.5", state.text)}>
      <span className={cn("h-2 w-2 rounded-full", state.dot, (stock > 0 || inTransit) && "animate-pulse motion-reduce:animate-none")} />
      {state.label}
    </p>
  );
}
