import { cn } from "@/lib/utils/cn";

export type SpecColor = "aqua" | "lavender" | "orange" | "white";

const colorMap: Record<SpecColor, { box: string; value: string; chip: string }> = {
  // Colored boxes keep constant dark ink (on-container) in both themes; their
  // chip is a constant dark pill with the box's light color as text.
  aqua: { box: "bg-primary-container", value: "text-on-container", chip: "bg-on-container text-primary-container" },
  lavender: { box: "bg-tertiary-container", value: "text-on-container", chip: "bg-on-container text-tertiary-container" },
  orange: { box: "bg-secondary-container", value: "text-on-container", chip: "bg-on-container text-secondary-container" },
  // Neutral box adapts with the theme.
  white: { box: "bg-surface-container-lowest", value: "text-on-background", chip: "bg-on-background text-surface" },
};

export function SpecBox({
  label,
  value,
  color = "aqua",
  rotate = false,
}: {
  label: string;
  value: string;
  color?: SpecColor;
  rotate?: boolean;
}) {
  const styles = colorMap[color];
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-thick border-on-background p-5 shadow-neo transition-transform",
        styles.box,
        rotate ? "rotate-1 hover:-rotate-1" : "-rotate-1 hover:rotate-1",
      )}
    >
      <span className={cn("px-3 py-1 font-label-mono text-label-mono uppercase", styles.chip)}>
        {label}
      </span>
      <span
        className={cn(
          "text-right font-headline-lg-mobile text-xl font-black uppercase md:text-2xl",
          styles.value,
        )}
      >
        {value}
      </span>
    </div>
  );
}
