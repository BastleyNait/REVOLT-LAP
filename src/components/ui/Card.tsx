import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

/** Bordered surface with a hard offset shadow — the base brutalist container. */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-thick border-on-background bg-surface-container-lowest shadow-neo-md",
        className,
      )}
      {...props}
    />
  );
}
