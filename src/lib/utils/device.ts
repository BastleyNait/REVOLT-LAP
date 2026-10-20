/**
 * ¿Aguanta este equipo los efectos caros (WebGL del logo, vidrio con
 * distorsión SVG en el navbar)? Mucha gente entra desde laptops y celulares
 * modestos, y ahí esos efectos son lag puro: mejor la versión estática, que se
 * ve casi igual. Solo se puede preguntar en el navegador; en el servidor
 * responde "no" y el componente arranca con la versión liviana.
 */
type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export function canRunRichEffects(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as NavigatorWithHints;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 4) < 4) return false;
  // deviceMemory solo existe en Chrome/Edge (y redondea hacia abajo: 0.5, 1, 2, 4, 8).
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  return true;
}

/**
 * Para el efecto más caro de todos (el filtro SVG que distorsiona lo que hay
 * detrás del navbar en cada scroll): solo en computadoras con mouse y CPU de
 * sobra. En el resto, el mismo vidrio con un desenfoque CSS común.
 */
export function canRunHeavyGlass(): boolean {
  if (!canRunRichEffects()) return false;
  const nav = navigator as NavigatorWithHints;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return false;
  if ((nav.hardwareConcurrency ?? 4) < 8) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 8) return false;
  return true;
}
