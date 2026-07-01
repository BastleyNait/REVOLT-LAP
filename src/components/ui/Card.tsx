import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

/** Frosted-glass surface — the base container of the design language. */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("glass rounded-2xl", className)} {...props} />;
}
