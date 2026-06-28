import { cn } from "@/lib/utils/cn";

/** Thin wrapper around Material Symbols (loaded via <link> in the root layout). */
export function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span aria-hidden className={cn("material-symbols-outlined", className)}>
      {name}
    </span>
  );
}
