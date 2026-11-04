/**
 * Lado cliente del nivel de efectos (ver fx.ts): leerlo, bajarlo y suscribirse.
 * Solo lo importan componentes de cliente.
 */
import { useSyncExternalStore } from "react";
import { AUTO_KEY, FX_EVENT, MANUAL_KEY, type FxTier } from "./fx";

export function getFxTier(): FxTier {
  if (typeof document === "undefined") return "lite";
  return document.documentElement.dataset.fx === "rich" ? "rich" : "lite";
}

/** ¿El visitante fijó el nivel a mano con ?fx=? Entonces no se mide ni se baja solo. */
export function hasManualFx(): boolean {
  try {
    const value = localStorage.getItem(MANUAL_KEY);
    return value === "rich" || value === "lite";
  } catch {
    return false;
  }
}

/** Baja a "lite" al instante y lo recuerda para las próximas visitas. */
export function downgradeFx(): void {
  document.documentElement.dataset.fx = "lite";
  try {
    localStorage.setItem(AUTO_KEY, String(Date.now()));
  } catch {
    // sin localStorage: vale para esta visita
  }
  window.dispatchEvent(new Event(FX_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(FX_EVENT, onChange);
  return () => window.removeEventListener(FX_EVENT, onChange);
}

/** true solo en el cliente y solo en nivel "rich"; reacciona si se baja a "lite". */
export function useRichFx(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => getFxTier() === "rich",
    () => false,
  );
}
