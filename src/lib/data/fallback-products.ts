import type { Product } from "@/lib/types/product";

/**
 * Demo catalogue used when Supabase is not configured yet (or as the offline
 * seed mirrored in supabase/seed.sql). Once Supabase is connected this is never
 * used for reads.
 *
 * Catalogue: Intel Core i7 11th-gen business laptops sourced from eBay refurb
 * listings. Purchase cost is kept at or under $200 USD; the sale price is quoted
 * in soles (PEN) as `costUSD × ~3.7 + 800` and rounded. Buyers may also pay the
 * USD equivalent (shown across the storefront).
 */
const IMG = "https://lh3.googleusercontent.com/aida-public";
const IMG_A = `${IMG}/AB6AXuAFejqBTHyDYdAVe6IEpTfL8i4WGgfSTrD5QDKLMcc_HA5VubNvDxg9_1iBFpYY_alOVs9R8qJMhIQ_-PDqNei9Yh6NtS0eFrpiJ_oCoQapz9MLPHVevmE_CuzMNKa482CGYT5w1pqtQvBcel_dKS9Exrnajc_rkL0UwAXSwYOGGT_ZbF0B8QDEdhd1_jL78oHMY3Q4qErlkpugWKXvk8BifBDNVbq2quvzLkH8i-l4SkO9yg1qBXbU285BlXHaA_eCnnnWoHQXanc`;
const IMG_B = `${IMG}/AB6AXuDx6_dgrrf40sr1S2UXUf9Zg1iO9IAbyQXpGcA_ULrM7DFn9S23GV09KQDHls1GR8SI4Dg9y4UNx5cadAKNz80UnfhLElqyp6O1dbf2217KgVZ1m5Gr3nMo76xHbSZEAcg0QqMWCU6jLHWRMU3fKBMljr4HYucAn-IKHluT4M_Ig9Yehy90eBOpnTTdTfv0UCIfIsJw6RNhHX_9pGuEiTq9xHpkdhVgT9u7JinuyqGVXhHmFagzYVsezoQVIj_wSJBA72BMS-KZ8uc`;
const IMG_C = `${IMG}/AB6AXuD51VHNHszqmtYTo7ZMHex-2yonyUVMxHitwqBDUpY2HjUAIXzieBN87grioIJBgOIPgAscLn8syxlpEz-LsRSp0dfsinHg8SlYIotr7kQ9TV1yheG94swyjm5ddhCJxDgfJ7XK-CsjyNzBhm5ujtUkNlaB1B-9IDiXlcPZeDUAB3BjQhMHXk_gilKsJxFVn7szZSJdAqQDy2ASrjrOCXBqgwBSvdgeumPYYX1zOcfyTxhzwt7TT66kuzJZoo0xJKlWG2fQ7KSoNGo`;
const IMG_D = `${IMG}/AB6AXuBlRzYH8L-udqDBH261pTgfKqCbC0YcfMzWcW7uSpq3hq96w2USyimYF2JuMwH6kynF8mkw8gUZVkIt1u6FgRkDVphCUyNzewmhB-XboO0eQgyMj9y_GOXufZ_HkZiiEmjU8mX6FeoQ6tzk4-5ZOX4CJd54r4Cj1EvmVqjcFfvYvDtgoePe9TX4yQT6bEV-3SxC228PmQwGAJY7nYkepaItQuRl4CrjetJghkn8Lgp_BDDSYt_07Tc2Ktzq5ALMbMNTOhCwc_5LRjg`;

export const fallbackProducts: Product[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "dell-latitude-5420-i7-11",
    name: "Dell Latitude 5420",
    brand: "Dell",
    price: 1410,
    originalPrice: 1750,
    currency: "PEN",
    conditionGrade: "Grado A",
    processor: "Intel Core i7-1165G7 (11.ª gen.)",
    ram: "16GB DDR4",
    storage: "512GB NVMe SSD",
    display: '14" FHD IPS',
    batteryHealth: "> 85% de capacidad",
    description:
      "El caballo de batalla empresarial. i7 de 11va generación con vPro, chasis reforzado y teclado retroiluminado. Reacondicionado y listo para toda una jornada de trabajo.",
    verdict:
      "Rendimiento de oficina sin sobreprecio corporativo. Ligera, resistente y con la mejor relación precio-potencia del inventario.",
    specs: [{ label: "PUERTOS", value: "USB-C/TB4, HDMI, RJ45, lector SD" }],
    images: [IMG_A],
    badges: ["MÁS VENDIDA"],
    stock: 6,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-06-01T10:00:00.000Z",
    updatedAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    slug: "dell-latitude-7420-i7-11",
    name: "Dell Latitude 7420",
    brand: "Dell",
    price: 1520,
    originalPrice: 1900,
    currency: "PEN",
    conditionGrade: "Grado A+ · Como nueva",
    processor: "Intel Core i7-1185G7 vPro (11.ª gen.)",
    ram: "16GB LPDDR4x",
    storage: "512GB NVMe SSD",
    display: '14" FHD (100% sRGB)',
    batteryHealth: "> 90% de capacidad",
    description:
      "La serie premium de Dell para ejecutivos. Chasis de aluminio, ultraligera y con el i7-1185G7 vPro, el tope de gama de la 11va generación.",
    verdict:
      "La más fina y elegante de las Latitude. Silenciosa, rápida y con una pantalla brillante. Un lujo de oficina a precio de reacondicionado.",
    specs: [
      { label: "PESO", value: "1.29 kg" },
      { label: "PUERTOS", value: "2x TB4, HDMI, USB-A" },
    ],
    images: [IMG_B],
    badges: ["Grado A+ · Como nueva"],
    stock: 4,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-06-02T10:00:00.000Z",
    updatedAt: "2026-06-02T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    slug: "dell-latitude-5520-i7-11",
    name: "Dell Latitude 5520",
    brand: "Dell",
    price: 1450,
    originalPrice: 1800,
    currency: "PEN",
    conditionGrade: "Grado A",
    processor: "Intel Core i7-1165G7 (11.ª gen.)",
    ram: "16GB DDR4",
    storage: "512GB NVMe SSD",
    display: '15.6" FHD IPS',
    batteryHealth: "> 88% de capacidad",
    description:
      "Pantalla grande de 15.6\" para quienes necesitan espacio de trabajo. i7 de 11va generación, teclado numérico completo y expansión de RAM.",
    verdict:
      "La opción de pantalla amplia. Ideal para hojas de cálculo, multitarea y trabajo prolongado sin fatiga visual.",
    specs: [{ label: "PUERTOS", value: "USB-C/TB4, 2x USB-A, HDMI, RJ45" }],
    images: [IMG_C],
    badges: ["PANTALLA 15.6\""],
    stock: 5,
    isActive: true,
    isFeatured: false,
    createdAt: "2026-06-03T10:00:00.000Z",
    updatedAt: "2026-06-03T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    slug: "lenovo-thinkpad-p14s-gen-2-i7-11",
    name: "Lenovo ThinkPad P14s Gen 2",
    brand: "Lenovo",
    price: 1500,
    originalPrice: 1950,
    currency: "PEN",
    conditionGrade: "Grado A",
    processor: "Intel Core i7-1165G7 (11.ª gen.)",
    ram: "16GB DDR4",
    storage: "512GB NVMe SSD",
    display: '14" FHD IPS',
    batteryHealth: "> 88% de capacidad",
    description:
      "Workstation portátil con gráficos dedicados NVIDIA T500. El legendario teclado ThinkPad y certificación militar de durabilidad.",
    verdict:
      "La única del catálogo con GPU dedicada. Para diseño CAD ligero, edición y quien exige el teclado más cómodo del mercado.",
    specs: [
      { label: "GPU", value: "NVIDIA T500 4GB" },
      { label: "PUERTOS", value: "2x TB4, 2x USB-A, HDMI, RJ45" },
    ],
    images: [IMG_C],
    badges: ["GPU DEDICADA"],
    stock: 3,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-06-04T10:00:00.000Z",
    updatedAt: "2026-06-04T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    slug: "hp-elitebook-840-g8-i7-11",
    name: "HP EliteBook 840 G8",
    brand: "HP",
    price: 1480,
    originalPrice: 1850,
    currency: "PEN",
    conditionGrade: "Grado A",
    processor: "Intel Core i7-1165G7 (11.ª gen.)",
    ram: "16GB DDR4",
    storage: "512GB NVMe SSD",
    display: '14" FHD IPS',
    batteryHealth: "> 87% de capacidad",
    description:
      "El estándar corporativo de HP. Chasis de aluminio, seguridad Sure View y una de las mejores webcams con obturador de privacidad.",
    verdict:
      "Elegante, segura y bien construida. Una alternativa premium con acabado de aluminio a precio imbatible.",
    specs: [{ label: "PUERTOS", value: "2x TB4, 2x USB-A, HDMI, RJ45" }],
    images: [IMG_D],
    badges: ["ALUMINIO"],
    stock: 5,
    isActive: true,
    isFeatured: false,
    createdAt: "2026-06-05T10:00:00.000Z",
    updatedAt: "2026-06-05T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    slug: "lenovo-thinkpad-x1-carbon-gen-9-i7-11",
    name: "Lenovo ThinkPad X1 Carbon Gen 9",
    brand: "Lenovo",
    price: 1540,
    originalPrice: 2100,
    currency: "PEN",
    conditionGrade: "Grado A+ · Como nueva",
    processor: "Intel Core i7-1185G7 (11.ª gen.)",
    ram: "16GB LPDDR4x",
    storage: "512GB NVMe SSD",
    display: '14" WUXGA IPS (16:10)',
    batteryHealth: "> 90% de capacidad",
    description:
      "El buque insignia ultraligero de Lenovo. Fibra de carbono, apenas 1.13 kg y el brillante panel 16:10. Plataforma Intel Evo.",
    verdict:
      "Rendimiento sin concesiones en el formato más ligero posible. Construida para la alta dirección y ahora a tu alcance.",
    specs: [
      { label: "PESO", value: "1.13 kg" },
      { label: "PUERTOS", value: "2x TB4, 2x USB-A, HDMI" },
    ],
    images: [IMG_C],
    badges: ["ULTRALIGERA", "1.13 KG"],
    stock: 2,
    isActive: true,
    isFeatured: false,
    createdAt: "2026-06-06T10:00:00.000Z",
    updatedAt: "2026-06-06T10:00:00.000Z",
  },
];

export function findFallbackBySlug(slug: string): Product | null {
  return fallbackProducts.find((product) => product.slug === slug) ?? null;
}

export function findFallbackById(id: string): Product | null {
  return fallbackProducts.find((product) => product.id === id) ?? null;
}
