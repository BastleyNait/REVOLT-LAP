import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeColor = "aqua" | "orange" | "lavender" | "dark" | "white" | "danger";

const colorClasses: Record<BadgeColor, string> = {
  aqua: "bg-primary/90 text-on-primary dark:bg-primary-container/80 dark:text-on-primary-container",
  orange: "bg-secondary/90 text-on-secondary dark:bg-secondary-container/80 dark:text-on-secondary-container",
  lavender: "bg-tertiary-container/90 text-on-tertiary-container",
  dark: "bg-on-background/85 text-background",
  white: "glass text-on-background",
  danger: "bg-error/90 text-on-error",
};

interface BadgeProps extends ComponentProps<"span"> {
  color?: BadgeColor;
}

/** Small translucent pill used for specs and marketing chips. */
export function Badge({ color = "aqua", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm shadow-neo-xs",
        colorClasses[color],
        className,
      )}
      {...props}
    />
  );
}
