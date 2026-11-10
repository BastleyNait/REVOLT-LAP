"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The storefront chrome (aurora background, glass navbar, footer) stays out of
 * /admin: the admin has its own header, and those effects only made editing
 * slower — the frosted navbar and the background were being drawn behind every
 * form field. Server components can be passed in as children.
 */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (/^\/(admin|envios)(\/|$)/.test(pathname ?? "")) return null;
  return <>{children}</>;
}
