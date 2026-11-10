import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Read-only star rating (supports halves for averages). */
export function Stars({ value, size = "md", className }: { value: number; size?: "sm" | "md" | "lg"; className?: string }) {
  const px = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)));
        return (
          <span key={n} className={cn("relative inline-block", px)}>
            <Star className={cn("absolute inset-0 text-white/20", px)} strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn("fill-[#f5b301] text-[#f5b301]", px)} strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
