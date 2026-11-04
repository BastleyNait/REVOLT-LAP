/**
 * ¿Aguanta este equipo los efectos caros (WebGL del logo, vidrio con
 * distorsión SVG en el navbar)? La decisión no se toma aquí: la toma el nivel
 * de efectos del sitio (`data-fx` en <html>, ver `fx.ts`), que se fija antes
 * del primer pintado y se corrige midiendo los FPS reales. En el servidor
 * responde "no" y el componente arranca con la versión liviana.
 */
import { getFxTier } from "./fx-client";

export function canRunRichEffects(): boolean {
  return typeof window !== "undefined" && getFxTier() === "rich";
}

/**
 * Para el efecto más caro de todos (el filtro SVG que distorsiona lo que hay
 * detrás del navbar en cada scroll): solo en nivel "rich" y con mouse. En el
 * resto, el mismo vidrio con un desenfoque CSS común (o transparencia simple).
 */
export function canRunHeavyGlass(): boolean {
  if (!canRunRichEffects()) return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
