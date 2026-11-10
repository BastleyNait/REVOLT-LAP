/**
 * Data for one shipment: what the form collects and the PDF (6 A4 pages:
 * 3 sheets of box labels, the shipping sheet, the thank-you letter and the
 * warranty certificate) prints.
 */

export type Delivery = "shalom" | "arequipa";

export interface Shipment {
  customer: {
    name: string;
    dni: string;
    phone: string;
    /** City / district of destination, e.g. "Lima — Santa Anita". */
    city: string;
    /** Shalom agency the customer picks up from, e.g. "Shalom Av. Los Frutales". */
    agency: string;
    /** Optional address or reference. */
    address: string;
  };
  order: {
    code: string;
    laptop: string;
    serial: string;
    /** Purchase date, YYYY-MM-DD. */
    date: string;
    /** Receipt number (boleta), optional. */
    receipt: string;
    delivery: Delivery;
    /** What goes in the box besides the laptop. */
    contents: string;
  };
  /** Optional personal line added to the thank-you letter. */
  note: string;
}

/** Store data printed as sender / signature (filled on the server from siteConfig). */
export interface Sender {
  brand: string;
  holder: string;
  ruc: string;
  phoneDisplay: string;
  whatsappUrl: string;
  city: string;
  /** Website host without protocol, e.g. "revolt-laptops.com". */
  web: string;
  /** Where the "leave us a review" QR points (Google Business or the website). */
  reviewUrl: string;
  warrantyMonths: number;
}

/** Today in Lima as YYYY-MM-DD. */
export function todayLima(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date());
}

/** Order code like REV-251110-4821 (date + 4 random digits). */
export function newOrderCode(date = todayLima()): string {
  const ymd = date.replace(/-/g, "").slice(2);
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `REV-${ymd}-${rand}`;
}

export function emptyShipment(): Shipment {
  const date = todayLima();
  return {
    customer: { name: "", dni: "", phone: "", city: "", agency: "", address: "" },
    order: {
      code: newOrderCode(date),
      laptop: "",
      serial: "",
      date,
      receipt: "",
      delivery: "shalom",
      contents: "Laptop + cargador original",
    },
    note: "",
  };
}

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y || 1970, (m || 1) - 1, d || 1, 12));
}

/** "10 de noviembre de 2026". */
export function longDate(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    parseDate(iso),
  );
}

/** Purchase date + N months (warranty end), as a long date. */
export function addMonthsLong(iso: string, months: number): string {
  const date = parseDate(iso);
  const day = date.getUTCDate();
  date.setUTCMonth(date.getUTCMonth() + months);
  // 31 Aug + 6 months must not roll over into March.
  if (date.getUTCDate() < day) date.setUTCDate(0);
  return longDate(date.toISOString().slice(0, 10));
}

export function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? "";
}

/** Fields the PDF can't do without. Returns the missing labels. */
export function missingFields(s: Shipment): string[] {
  const missing: string[] = [];
  if (!s.customer.name.trim()) missing.push("Nombre del cliente");
  if (!s.customer.phone.trim()) missing.push("Celular");
  if (s.order.delivery === "shalom" && !s.customer.city.trim()) missing.push("Ciudad de destino");
  if (!s.order.laptop.trim()) missing.push("Laptop");
  return missing;
}
