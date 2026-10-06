/**
 * Display-time Spanish for catalogue labels that may still be stored in
 * English (older rows, the old "REFURBISHED" default, imported listings).
 * Unknown values pass through untouched.
 */

const EXACT: Record<string, string> = {
  REFURBISHED: "Reacondicionada",
  "CERTIFIED REFURBISHED": "Reacondicionada certificada",
  "GRADE A": "Grado A",
  "GRADE A MINT": "Grado A+ · Como nueva",
  "GRADE A+": "Grado A+",
  "GRADE B": "Grado B",
  "GRADE C": "Grado C",
  MINT: "Como nueva",
  "LIKE NEW": "Como nueva",
  NEW: "Nueva",
  "OPEN BOX": "Caja abierta",
  USED: "Usada",
  EXCELENTE: "Excelente estado",
  EXCELLENT: "Excelente estado",
  GOOD: "Buen estado",
  "VERY GOOD": "Muy buen estado",
  FAIR: "Estado regular",
  "BEST SELLER": "Más vendida",
  BESTSELLER: "Más vendida",
  "TOP SELLER": "Más vendida",
  "HOT DEAL": "Oferta",
  DEAL: "Oferta",
  SALE: "Oferta",
  FEATURED: "Destacada",
  "LIMITED STOCK": "Stock limitado",
  "FREE SHIPPING": "Envío gratis",
  "DEDICATED GPU": "GPU dedicada",
  ULTRALIGHT: "Ultraligera",
  ALUMINUM: "Aluminio",
  TOUCHSCREEN: "Pantalla táctil",
  "TOUCH SCREEN": "Pantalla táctil",
  PROCESSOR: "Procesador",
  MEMORY: "Memoria",
  STORAGE: "Almacenamiento",
  DISPLAY: "Pantalla",
  SCREEN: "Pantalla",
  BATTERY: "Batería",
  "BATTERY HEALTH": "Salud de batería",
  WEIGHT: "Peso",
  PORTS: "Puertos",
  GRAPHICS: "Gráficos",
  KEYBOARD: "Teclado",
  CAMERA: "Cámara",
  WEBCAM: "Cámara web",
  "OPERATING SYSTEM": "Sistema operativo",
  OS: "Sistema operativo",
  WARRANTY: "Garantía",
  CONNECTIVITY: "Conectividad",
};

const PARTIAL: Array<[RegExp, string]> = [
  [/\bCAPACITY\b/gi, "de capacidad"],
  [/\bcycles?\b/gi, "ciclos"],
  [/\b(\d+(?:\.\d+)?) ?(?:in|inch|inches)\b/gi, '$1"'],
  [/\((\d+)(?:st|nd|rd|th) Gen\)/gi, "($1.ª gen.)"],
  [/\b(\d+)(?:st|nd|rd|th) Gen\b/gi, "$1.ª gen."],
  [/\bMONTHS? WARRANTY\b/gi, "meses de garantía"],
  [/\bBacklit keyboard\b/gi, "teclado retroiluminado"],
  [/\bFingerprint reader\b/gi, "lector de huellas"],
];

export function localizeLabel(value: string): string;
export function localizeLabel(value: string | null | undefined): string | null;
export function localizeLabel(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  const exact = EXACT[trimmed.toUpperCase()];
  if (exact) return exact;
  return PARTIAL.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), trimmed);
}

/** "512" → "512GB": capacities typed without a unit in the admin. */
export function withCapacityUnit(value: string): string {
  return /^\d+(?:\.\d+)?$/.test(value.trim()) ? `${value.trim()}GB` : value;
}

/** "EXCELENTE ESTADO" → "Excelente estado": labels typed in all caps. */
export function sentenceCase(value: string): string {
  const letters = value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "");
  if (letters.length < 4 || letters !== letters.toUpperCase()) return value;
  const lower = value.toLocaleLowerCase("es-PE");
  return lower.charAt(0).toLocaleUpperCase("es-PE") + lower.slice(1);
}

/** Condition/grade as shown on the storefront: Spanish and sentence case. */
export function conditionLabel(grade: string): string {
  return sentenceCase(localizeLabel(grade));
}
