import type { CSSProperties } from "react";
import { siteConfig } from "@/lib/config/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

/** Frosted bar with the short trust points (stock, shipping, all working, receipt). Hero + landings. */
export function TrustBar({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <ul
      className={cn(
        "fx-panel flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl border border-white/15 bg-black/20 px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl",
        className,
      )}
      style={style}
    >
      {siteConfig.home.hero.stats.map((stat) => (
        <li key={stat.label} className="flex items-center gap-2 text-sm font-bold text-white/90">
          <Icon name={stat.icon} className="text-lg text-primary" />
          {stat.label}
        </li>
      ))}
    </ul>
  );
}
