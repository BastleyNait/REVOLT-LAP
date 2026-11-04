"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

type CopyState = "idle" | "copied" | "error";

/**
 * Copies text with the async Clipboard API and falls back to a hidden textarea
 * (`execCommand`) where it is missing: plain-http pages (e.g. testing from a
 * phone over the LAN IP) are not a secure context, so `navigator.clipboard`
 * is undefined there.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or blocked: try the fallback below.
  }

  const previous = document.activeElement as HTMLElement | null;
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
  document.body.appendChild(field);
  field.focus({ preventScroll: true });
  field.select();
  field.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  previous?.focus({ preventScroll: true });
  return ok;
}

const FEEDBACK_MS = 1800;

/**
 * Quiet share button for catalogue cards: one tap copies the product link to
 * the clipboard and confirms it (icon turns into a check + a small "Enlace
 * copiado" bubble; announced to screen readers through a live region).
 * Sits above the card's stretched link (`z-10`) so it doesn't open the product.
 */
export function ShareButton({ href, label, className }: { href: string; label: string; className?: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleClick() {
    const url = new URL(href, window.location.origin).toString();
    const ok = await copyText(url);
    setState(ok ? "copied" : "error");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), FEEDBACK_MS);
  }

  const message = state === "copied" ? "Enlace copiado" : state === "error" ? "No se pudo copiar" : "";

  return (
    <div className={cn("relative z-10", className)}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Copiar enlace de ${label}`}
        className={cn(
          "relative grid size-10 cursor-pointer place-items-center rounded-full text-lg transition-[transform,background-color,color] duration-150 ease-out-strong active:scale-[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
          state === "copied" ? "text-primary" : state === "error" ? "text-deal" : "text-on-surface-variant hover:bg-white/10 hover:text-on-background",
        )}
      >
        <Icon
          name="share"
          className={cn(
            "absolute transition-[opacity,transform] duration-200 ease-out-strong",
            state === "copied" ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <Icon
          name="check-plain"
          strokeWidth={2.5}
          className={cn(
            "absolute transition-[opacity,transform] duration-200 ease-out-strong",
            state === "copied" ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </button>

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-full right-0 mb-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold shadow-lg backdrop-blur-md transition-[opacity,transform] duration-200 ease-out-strong",
          state === "error" ? "border-deal/40 bg-black/80 text-deal" : "border-primary/40 bg-black/80 text-primary",
          message ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        {message || "Enlace copiado"}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {message}
      </span>
    </div>
  );
}
