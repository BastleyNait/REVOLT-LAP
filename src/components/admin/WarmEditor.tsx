"use client";

import { useEffect } from "react";

/**
 * Downloads the rich-text editor (TipTap, the heaviest piece of the admin) in
 * the background while you look at the product list, so "Editar" opens with
 * the editor already in the browser cache instead of fetching ~400 KB first.
 */
export function WarmEditor() {
  useEffect(() => {
    const warm = () => void import("./RichTextEditor");
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(warm, 1500);
    return () => clearTimeout(id);
  }, []);
  return null;
}
