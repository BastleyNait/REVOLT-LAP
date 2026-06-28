import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeColor = "aqua" | "orange" | "lavender" | "dark" | "white" | "danger";

const colorClasses: Record<BadgeColor, string> = {
  aqua: "bg-primary-container text-on-container",
  orange: "bg-secondary-container text-on-container",
  lavender: "bg-tertiary-container text-on-container",
  dark: "bg-on-background text-surface",
  white: "bg-surface-container-lowest text-on-background",
  danger: "bg-error text-on-error",
};

interface BadgeProps extends ComponentProps<"span"> {
  color?: BadgeColor;
}

/** Small rectangular spec/marketing chip with a 2px border + tiny hard shadow. */
export function Badge({ color = "aqua", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border-thin border-on-background px-3 py-1 font-label-mono text-label-mono font-bold uppercase shadow-neo-xs",
        colorClasses[color],
        className,
      )}
      {...props}
    />
  );
}
