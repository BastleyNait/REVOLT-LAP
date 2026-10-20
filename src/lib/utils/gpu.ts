import type { Product } from "@/lib/types/product";

/**
 * Tarjeta gráfica dedicada del producto, o null. No hay un campo propio en la
 * base: se lee de "Especificaciones extra" (GPU: …) y, si no está ahí, del
 * estado, las etiquetas o el nombre, que es donde suele quedar escrita. Una
 * gráfica integrada (Intel UHD / Iris Xe, "AMD Radeon Graphics") no cuenta:
 * no es un argumento de venta.
 */
const DEDICATED_RE =
  /\b(?:nvidia|quadro|geforce|rtx\s*a?\d{3,4}|gtx\s*\d{3,4}|mx\s*\d{3}|radeon\s+(?:pro|rx)\b|dedicad[ao]|dedicated)/i;
const INTEGRATED_RE = /\b(?:intel\s+(?:uhd|iris|hd)|iris\s*xe|radeon\s+(?:graphics|vega))\b/i;
const GPU_LABEL_RE = /\b(?:gpu|gr[aá]fic[ao]s?|graphics|tarjeta\s+de\s+video|video)\b/i;

function clean(value: string): string {
  return value.replace(/^\s*(?:gpu|gr[aá]fica|graphics)\s*[:\-]?\s*/i, "").trim();
}

export function dedicatedGpu(product: Pick<Product, "specs" | "badges" | "conditionGrade" | "name">): string | null {
  const fromSpec = product.specs.find((spec) => GPU_LABEL_RE.test(spec.label));
  if (fromSpec) return DEDICATED_RE.test(fromSpec.value) && !INTEGRATED_RE.test(fromSpec.value) ? clean(fromSpec.value) : null;

  for (const text of [product.conditionGrade, ...product.badges]) {
    if (text && DEDICATED_RE.test(text) && !INTEGRATED_RE.test(text) && /\b(?:nvidia|quadro|geforce|rtx|gtx|mx\s*\d|radeon)\b/i.test(text)) {
      return clean(text);
    }
  }
  const inName = product.name.match(/\b(?:nvidia\s+)?(?:quadro\s+\w+|rtx\s*a?\d{3,4}|gtx\s*\d{3,4}(?:\s*ti)?|geforce\s+\w+\s*\d*|radeon\s+(?:pro|rx)\s*\w+)(?:\s*\d{1,2}\s?gb)?/i);
  return inName ? clean(inName[0]) : null;
}
