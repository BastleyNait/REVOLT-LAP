"use client";

import type { ComponentProps } from "react";
import { track } from "@vercel/analytics";

/**
 * Outbound WhatsApp link that records a `whatsapp_click` event in Vercel Web
 * Analytics (custom events need a Pro plan; on Hobby the call is a no-op).
 * Only the click origin and product slug are sent — never buyer data.
 */
export function WhatsappLink({
  source,
  product,
  onClick,
  ...props
}: ComponentProps<"a"> & { href: string; source: string; product?: string }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      onClick={(event) => {
        track("whatsapp_click", product ? { source, product } : { source });
        onClick?.(event);
      }}
    />
  );
}
