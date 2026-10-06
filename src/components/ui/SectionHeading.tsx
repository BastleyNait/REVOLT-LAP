import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Left-aligned <h2> + optional subtitle and a right-hand slot (count, link…). */
export function SectionHeading({
  id,
  title,
  subtitle,
  aside,
  className,
}: {
  id?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl space-y-2">
        <h2 id={id} className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
          {title}
        </h2>
        {subtitle ? <p className="text-lg leading-relaxed text-on-surface-variant">{subtitle}</p> : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
