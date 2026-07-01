import { cn } from "@/lib/utils/cn";

export type SpecColor = "aqua" | "lavender" | "orange" | "white";

const dotColor: Record<SpecColor, string> = {
  aqua: "bg-primary",
  lavender: "bg-tertiary",
  orange: "bg-secondary",
  white: "bg-on-surface-variant",
};

export function SpecBox({
  label,
  value,
  color = "aqua",
}: {
  label: string;
  value: string;
  color?: SpecColor;
  rotate?: boolean;
}) {
  return (
    <div className="glass flex items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-transform hover:-translate-y-0.5">
      <span className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
        <span className={cn("h-2.5 w-2.5 rounded-full", dotColor[color])} />
        {label}
      </span>
      <span className="text-right text-lg font-bold tracking-tight">{value}</span>
    </div>
  );
}
