"use client";

import { useState, type ReactNode } from "react";
import type { Availability } from "@/lib/types/product";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

type Filter = "all" | Availability;

export interface CatalogItem {
  id: string;
  availability: Availability;
  /** Server-rendered <ProductCard />, passed through as-is. */
  card: ReactNode;
}

const ORDER: Filter[] = ["all", "in-stock", "incoming", "sold-out"];

/**
 * Availability filter for the catalogue (Todas / En stock / En camino /
 * Agotadas). The cards stay server-rendered; this only decides which ones are
 * shown. A filter with no products is disabled so it never leads to a blank grid.
 */
export function CatalogFilter({ items }: { items: CatalogItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const copy = siteConfig.home.inventory.filters;

  const counts: Record<Filter, number> = { all: items.length, "in-stock": 0, incoming: 0, "sold-out": 0 };
  for (const item of items) counts[item.availability] += 1;

  const visible = filter === "all" ? items : items.filter((item) => item.availability === filter);

  return (
    <div className="space-y-6">
      <div
        role="group"
        aria-label={copy.label}
        className="scrollbar-none -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        {ORDER.map((key) => {
          const active = filter === key;
          const disabled = key !== "all" && counts[key] === 0;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              disabled={disabled}
              onClick={() => setFilter(key)}
              className={cn(
                "inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-semibold transition-[transform,background-color,border-color,color] duration-150 ease-out-strong active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-40",
                active
                  ? "border-primary bg-primary text-on-primary shadow-[0_0_18px_rgb(var(--c-primary)/0.3)]"
                  : "border-white/15 bg-white/5 text-on-background hover:border-primary/50 hover:text-primary",
              )}
            >
              {copy[key]}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                  active ? "bg-black/20 text-on-primary" : "bg-white/10 text-on-surface-variant",
                )}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id} className="h-full">
              {item.card}
            </li>
          ))}
        </ul>
      ) : (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="text-lg font-semibold text-on-surface-variant">{copy.emptyFilter}</p>
        </div>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "laptop" : "laptops"}
      </p>
    </div>
  );
}
