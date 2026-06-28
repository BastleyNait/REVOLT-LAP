import type { Product } from "@/lib/types/product";

/**
 * Demo catalogue used when Supabase is not configured yet (or as the offline
 * seed mirrored in supabase/seed.sql). Imagery comes from the original Stitch
 * "REVOLT" mockups. Once Supabase is connected this is never used for reads.
 */
const IMG = "https://lh3.googleusercontent.com/aida-public";

export const fallbackProducts: Product[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "thinkpad-t480",
    name: "ThinkPad T480",
    brand: "Lenovo",
    price: 299,
    originalPrice: 389,
    currency: "USD",
    conditionGrade: "GRADE A",
    processor: "Intel Core i5 8th Gen",
    ram: "16GB RAM",
    storage: "512GB SSD",
    display: '14" FHD IPS',
    batteryHealth: "> 85% CAPACITY",
    description:
      "The indestructible workhorse. Refurbished to a pristine state, ready for a full day of work without compromise.",
    verdict:
      "If you need a machine that simply refuses to die, this is it. Built like a tank, priced like a steal.",
    specs: [{ label: "PORTS", value: "USB-C, HDMI, RJ45" }],
    images: [
      `${IMG}/AB6AXuAFejqBTHyDYdAVe6IEpTfL8i4WGgfSTrD5QDKLMcc_HA5VubNvDxg9_1iBFpYY_alOVs9R8qJMhIQ_-PDqNei9Yh6NtS0eFrpiJ_oCoQapz9MLPHVevmE_CuzMNKa482CGYT5w1pqtQvBcel_dKS9Exrnajc_rkL0UwAXSwYOGGT_ZbF0B8QDEdhd1_jL78oHMY3Q4qErlkpugWKXvk8BifBDNVbq2quvzLkH8i-l4SkO9yg1qBXbU285BlXHaA_eCnnnWoHQXanc`,
    ],
    badges: ["BEST SELLER"],
    stock: 7,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-06-01T10:00:00.000Z",
    updatedAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    slug: "macbook-air-m1",
    name: "MacBook Air M1",
    brand: "Apple",
    price: 650,
    originalPrice: null,
    currency: "USD",
    conditionGrade: "GRADE A MINT",
    processor: "Apple Silicon (2020)",
    ram: "8GB RAM",
    storage: "256GB SSD",
    display: '13.3" Retina',
    batteryHealth: "> 90% CAPACITY",
    description:
      "Silent, fanless and absurdly efficient. Apple Silicon performance at a fraction of the retail price.",
    verdict: "Still the best value laptop Apple ever shipped. Cool, quiet, and fast.",
    specs: [{ label: "GPU", value: "7-Core GPU" }],
    images: [
      `${IMG}/AB6AXuBlRzYH8L-udqDBH261pTgfKqCbC0YcfMzWcW7uSpq3hq96w2USyimYF2JuMwH6kynF8mkw8gUZVkIt1u6FgRkDVphCUyNzewmhB-XboO0eQgyMj9y_GOXufZ_HkZiiEmjU8mX6FeoQ6tzk4-5ZOX4CJd54r4Cj1EvmVqjcFfvYvDtgoePe9TX4yQT6bEV-3SxC228PmQwGAJY7nYkepaItQuRl4CrjetJghkn8Lgp_BDDSYt_07Tc2Ktzq5ALMbMNTOhCwc_5LRjg`,
    ],
    badges: ["SILENT", "FANLESS"],
    stock: 3,
    isActive: true,
    isFeatured: false,
    createdAt: "2026-06-02T10:00:00.000Z",
    updatedAt: "2026-06-02T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    slug: "dell-xps-15",
    name: "Dell XPS 15",
    brand: "Dell",
    price: 899,
    originalPrice: null,
    currency: "USD",
    conditionGrade: "GRADE A",
    processor: "Intel Core i7 11th Gen",
    ram: "32GB RAM",
    storage: "1TB NVMe",
    display: '15.6" 4K OLED',
    batteryHealth: "> 88% CAPACITY",
    description:
      "A creator's powerhouse. Stunning 4K OLED panel paired with serious compute for editing and rendering.",
    verdict: "The OLED panel alone justifies the price. A genuine desktop replacement.",
    specs: [{ label: "GPU", value: "NVIDIA GTX 1650Ti" }],
    images: [
      `${IMG}/AB6AXuDx6_dgrrf40sr1S2UXUf9Zg1iO9IAbyQXpGcA_ULrM7DFn9S23GV09KQDHls1GR8SI4Dg9y4UNx5cadAKNz80UnfhLElqyp6O1dbf2217KgVZ1m5Gr3nMo76xHbSZEAcg0QqMWCU6jLHWRMU3fKBMljr4HYucAn-IKHluT4M_Ig9Yehy90eBOpnTTdTfv0UCIfIsJw6RNhHX_9pGuEiTq9xHpkdhVgT9u7JinuyqGVXhHmFagzYVsezoQVIj_wSJBA72BMS-KZ8uc`,
    ],
    badges: ["CREATOR"],
    stock: 2,
    isActive: true,
    isFeatured: false,
    createdAt: "2026-06-03T10:00:00.000Z",
    updatedAt: "2026-06-03T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    slug: "macbook-pro-14-m1-pro",
    name: 'Apple MacBook Pro 14" (M1 Pro)',
    brand: "Apple",
    price: 1299,
    originalPrice: 1599,
    currency: "USD",
    conditionGrade: "GRADE A MINT",
    processor: "M1 Pro (8-Core)",
    ram: "16GB Unified",
    storage: "512GB SSD",
    display: '14.2" Liquid Retina XDR',
    batteryHealth: "> 90% CAPACITY",
    description:
      "Uncompromising performance for professionals. Refurbished to pristine condition, thoroughly tested, and ready for heavy workloads.",
    verdict:
      "Professional-grade power with zero corporate markup. The mini-LED display is reference quality.",
    specs: [
      { label: "GPU", value: "14-Core GPU" },
      { label: "PORTS", value: "3x TB4, HDMI, SDXC" },
    ],
    images: [
      `${IMG}/AB6AXuD51VHNHszqmtYTo7ZMHex-2yonyUVMxHitwqBDUpY2HjUAIXzieBN87grioIJBgOIPgAscLn8syxlpEz-LsRSp0dfsinHg8SlYIotr7kQ9TV1yheG94swyjm5ddhCJxDgfJ7XK-CsjyNzBhm5ujtUkNlaB1B-9IDiXlcPZeDUAB3BjQhMHXk_gilKsJxFVn7szZSJdAqQDy2ASrjrOCXBqgwBSvdgeumPYYX1zOcfyTxhzwt7TT66kuzJZoo0xJKlWG2fQ7KSoNGo`,
      `${IMG}/AB6AXuBvD913EoXFawU6Nhyf6ccJfgpa5rO7nrMj9fcEJHeRyjbtmiQ6nKDcKFQcZp8eWR8Bc7idd4QxA7eI9teZQMSFDjoe0tGrsWe9Gq2uY8lDlNmKzR1arP0d8y4i_ILjo2VD6iidbyMWOtDhfE6HCi8zAOgW4GA_96iA_w_sDX2n4YgekfU9M9kGlUTjF9UvqBVms93b8aNP0h_mtpGIV0iORZj4S8GcVC9Pf4CZRexaavpMX8WshTgD-HPRv0chPiryXuyBcapLOcE`,
      `${IMG}/AB6AXuBEK4unce7ZMmA3-NjU93bmWvUt_GrMr-LNVuRI4Zpj_d-eP-EAV4JQ-XE5b8LMcrQ0uUk-Z-lfkT0rPlNnfaKnPLIyM3s6fObmnPE3c3FjJOSGXSG3ohm9l21UGCL1qUPduvg1l6tjko2Wh31EAPW6XYZm64Hq1TiN0RLvyqHVotJsTqRBDORl1BerBSDuI9ufX7arRp6QsCqBs-CVF2d5cOlLoy0Td0B7iMrKThdITmhdVjWdYMSJkCxlYwjdcyuE89sztlSxEZ8`,
    ],
    badges: ["GRADE A MINT", "6 MONTH WARRANTY"],
    stock: 4,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-06-04T10:00:00.000Z",
    updatedAt: "2026-06-04T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    slug: "thinkpad-x1-carbon-gen-9",
    name: "ThinkPad X1 Carbon Gen 9",
    brand: "Lenovo",
    price: 899,
    originalPrice: 999,
    currency: "USD",
    conditionGrade: "GRADE A",
    processor: "Intel i7-1185G7",
    ram: "16GB LPDDR4x",
    storage: "512GB NVMe SSD",
    display: '14" WUXGA IPS',
    batteryHealth: "> 92% CAPACITY",
    description:
      "Featherweight carbon-fibre chassis with business-class durability and a gorgeous 16:10 panel.",
    verdict:
      "Uncompromising performance in a ridiculously light form factor. This machine was built for the executive suite and priced for the trenches. Professionally refurbished to Grade A standards. Zero distractions, maximum output.",
    specs: [{ label: "WEIGHT", value: "1.13 kg" }],
    images: [
      `${IMG}/AB6AXuD51VHNHszqmtYTo7ZMHex-2yonyUVMxHitwqBDUpY2HjUAIXzieBN87grioIJBgOIPgAscLn8syxlpEz-LsRSp0dfsinHg8SlYIotr7kQ9TV1yheG94swyjm5ddhCJxDgfJ7XK-CsjyNzBhm5ujtUkNlaB1B-9IDiXlcPZeDUAB3BjQhMHXk_gilKsJxFVn7szZSJdAqQDy2ASrjrOCXBqgwBSvdgeumPYYX1zOcfyTxhzwt7TT66kuzJZoo0xJKlWG2fQ7KSoNGo`,
    ],
    badges: ["IN STOCK", "READY TO SHIP"],
    stock: 5,
    isActive: true,
    isFeatured: false,
    createdAt: "2026-06-05T10:00:00.000Z",
    updatedAt: "2026-06-05T10:00:00.000Z",
  },
];

export function findFallbackBySlug(slug: string): Product | null {
  return fallbackProducts.find((product) => product.slug === slug) ?? null;
}

export function findFallbackById(id: string): Product | null {
  return fallbackProducts.find((product) => product.id === id) ?? null;
}
