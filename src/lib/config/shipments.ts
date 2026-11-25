/**
 * Envíos reales (página /nuestros-envios y el botón del hero): a otras ciudades
 * por Shalom y entregas en persona dentro de Arequipa (transport: "local").
 *
 * Para agregar un envío: pon sus fotos YA TAPADAS (sin apellidos, DNI,
 * celular, dirección, código de pedido ni QR) en /public/nuestros-envios/ y
 * suma un objeto aquí. El mapa, los contadores y la opinión del cliente se
 * actualizan solos. `customer` debe escribirse igual que en su opinión
 * publicada (p. ej. "Daniela A.") para que se muestre junto a su envío.
 */

export type Transport = "aereo" | "terrestre" | "local";

export interface ShipmentPhoto {
  src: string;
  alt: string;
  /** Show the whole photo (e.g. a wide ticket) instead of cropping it. */
  contain?: boolean;
  /** Which part stays visible when the photo is cropped, e.g. "50% 25%" (CSS object-position). */
  focus?: string;
}

export interface RealShipment {
  id: string;
  city: string;
  region: string;
  /** [longitude, latitude] of the destination city. */
  coords: readonly [number, number];
  /** YYYY-MM-DD (only the month and year are shown). */
  date: string;
  /** Short public name, the same one the customer used in their review. */
  customer: string;
  /** Leave empty when unknown: the page says nothing about it. */
  transport?: Transport;
  freeShipping?: boolean;
  /** Which side of the dot the city label goes on the map. */
  labelSide?: "left" | "right";
  photos: ShipmentPhoto[];
  /** Optional video (e.g. hosted on R2). */
  video?: { src: string; poster: string };
}

/**
 * Laptops entregadas en total (con o sin fotos aquí). Súbelo con cada venta:
 * se muestra como "10+" en /nuestros-envios.
 */
export const DELIVERED_TOTAL = 10;

export const SHIPPING_ORIGIN = {
  city: "Arequipa",
  coords: [-71.5375, -16.409] as const,
};

export const realShipments: RealShipment[] = [
  {
    id: "arequipa-2026-11",
    city: "Arequipa",
    region: "José Luis Bustamante y Rivero",
    coords: SHIPPING_ORIGIN.coords,
    date: "2026-11-21",
    customer: "Claudia R.",
    transport: "local",
    photos: [
      { src: "/nuestros-envios/arequipa-entrega.jpg", alt: "Caja con la guía REVOLT entregada a domicilio en Arequipa, con los datos personales ocultos", focus: "50% 60%" },
    ],
  },
  {
    id: "chiclayo-2026-11",
    city: "Chiclayo",
    region: "Lambayeque",
    coords: [-79.8407, -6.7714],
    date: "2026-11-10",
    customer: "Daniela A.",
    transport: "aereo",
    freeShipping: true,
    photos: [
      { src: "/nuestros-envios/chiclayo-etiquetas.jpg", alt: "Caja embalada con etiquetas FRÁGIL en cada cara" },
      { src: "/nuestros-envios/chiclayo-guia.jpg", alt: "Guía de envío REVOLT a Chiclayo, con los datos personales ocultos" },
      { src: "/nuestros-envios/chiclayo-agencia.jpg", alt: "La caja llegando a la agencia Shalom en Arequipa" },
      { src: "/nuestros-envios/chiclayo-ticket.jpg", alt: "Ticket de Shalom: Chiclayo, Av. Las Américas, envío aéreo", contain: true },
    ],
  },
  {
    id: "moquegua-2026-11",
    city: "Moquegua",
    region: "Moquegua",
    coords: [-70.9353, -17.1956],
    date: "2026-11-14",
    customer: "Huber C.",
    transport: "terrestre",
    photos: [
      { src: "/nuestros-envios/moquegua-guia.jpg", alt: "Guía de envío REVOLT a Moquegua, con los datos personales ocultos", focus: "50% 24%" },
      { src: "/nuestros-envios/moquegua-agencia.jpg", alt: "La caja en la fila de la agencia Shalom" },
      { src: "/nuestros-envios/moquegua-ticket.jpg", alt: "Ticket de Shalom: Mariscal Nieto, Moquegua, Calle Lima, envío terrestre", contain: true },
    ],
  },
];

export const TRANSPORT_LABEL: Record<Transport, string> = {
  aereo: "Envío aéreo",
  terrestre: "Envío terrestre",
  local: "Entrega a domicilio",
};

/** Delivered inside the origin city (no Shalom trip, no arc on the map). */
export const isLocalDelivery = (s: RealShipment) => s.city === SHIPPING_ORIGIN.city;

/** Distinct destination cities. */
export const shippedCities = Array.from(new Set(realShipments.map((s) => s.city)));
