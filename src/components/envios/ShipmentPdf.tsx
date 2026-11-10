import { Document, Font, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { LOGO_MARK, LOGO_WORD } from "@/lib/envios/logo";
import { firstName, longDate, type Sender, type Shipment } from "@/lib/envios/types";

/**
 * The shipment PDF: 5 A4 pages designed for a home printer on plain white
 * paper — line art, thin strokes and white backgrounds, no large ink fills.
 *
 *   1–3  Box labels, 2 per sheet (6 = one per side of the box)
 *   4    Shipping sheet (recipient / sender)
 *   5    Thank-you letter (goes inside the box), with the buyer's own
 *        one-time QR to leave a verified review
 */

/** Style prop of a react-pdf View (without importing its internal types package). */
type Style = Exclude<NonNullable<React.ComponentProps<typeof View>["style"]>, readonly unknown[]>;

const C = {
  ink: "#1c1f1e",
  muted: "#66706c",
  faint: "#9aa5a0",
  line: "#d5ddd9",
  green: "#12B480",
  greenDark: "#0c8a62",
};

let fontsReady = false;
/** Register Archivo Narrow from `base` (a URL path in the browser, a folder in Node). */
export function registerPdfFonts(base: string) {
  if (fontsReady) return;
  Font.register({
    family: "Archivo",
    fonts: [400, 500, 600, 700].map((weight) => ({ src: `${base}/archivo-narrow-${weight}.woff`, fontWeight: weight })),
  });
  // Never hyphenate Spanish words across lines.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

const s = StyleSheet.create({
  page: { fontFamily: "Archivo", color: C.ink, fontSize: 11, backgroundColor: "#ffffff" },
  label: { fontSize: 8, fontWeight: 600, letterSpacing: 1.6, textTransform: "uppercase", color: C.muted },
  row: { flexDirection: "row" },
});

/* ───────────────────────────── shared pieces ───────────────────────────── */

function Mark({ size, color = C.green }: { size: number; color?: string }) {
  const h = (size * LOGO_MARK.height) / LOGO_MARK.width;
  return (
    <Svg width={size} height={h} viewBox={`0 0 ${LOGO_MARK.width} ${LOGO_MARK.height}`}>
      <Path d={LOGO_MARK.d} fill={color} />
    </Svg>
  );
}

function Wordmark({ width }: { width: number }) {
  const h = (width * LOGO_WORD.height) / LOGO_WORD.width;
  return (
    <Svg width={width} height={h} viewBox={`0 0 ${LOGO_WORD.width} ${LOGO_WORD.height}`}>
      <Path d={LOGO_WORD.re} fill={C.ink} />
      <Path d={LOGO_WORD.volt} fill={C.green} />
    </Svg>
  );
}

function Logo({ mark = 30, word = 104 }: { mark?: number; word?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: mark * 0.32 }}>
      <Mark size={mark} />
      <Wordmark width={word} />
    </View>
  );
}

/** QR code drawn as one vector path (crisp, prints in a single pass). */
function Qr({ value, size }: { value: string; size: number }) {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: "M" });
  const n = modules.size;
  let d = "";
  for (let y = 0; y < n; y++) {
    let x = 0;
    while (x < n) {
      if (modules.get(y, x)) {
        const start = x;
        while (x < n && modules.get(y, x)) x++;
        d += `M${start} ${y}h${x - start}v1h${start - x}Z`;
      } else x++;
    }
  }
  return (
    <Svg width={size} height={size} viewBox={`-2 -2 ${n + 4} ${n + 4}`}>
      <Path d={d} fill={C.ink} />
    </Svg>
  );
}

/** Line-art icons (48×48 grid, stroked — almost no ink). */
const ICONS: Record<string, string[]> = {
  fragile: ["M14 5h20l-1.4 13.5a8.7 8.7 0 0 1-17.2 0Z", "M22.5 6.5l3 5.2-3.4 3.1 3.1 4.4", "M24 27.2V40", "M16 42.5h16"],
  up: ["M15 41V9", "M8 16l7-7 7 7", "M33 41V9", "M26 16l7-7 7 7", "M6 44h36"],
  dry: ["M5 24a19 19 0 0 1 38 0Z", "M24 5v2", "M24 24v13a4.5 4.5 0 0 1-9 0", "M11 33l-2 4", "M38 33l-2 4", "M33 40l-2 4"],
  laptop: ["M10 11h28v19H10Z", "M4 35h40l-3.5 5h-33Z"],
  shield: ["M24 5l15 5v11c0 10-6.5 17-15 21C15.5 38 9 31 9 21V10Z", "M17 23.5l5 5 9-10"],
  chat: ["M8 10h32v22H22l-9 7v-7H8Z"],
  star: ["M24 6l5.3 11.2 12.2 1.5-9 8.4 2.4 12.1L24 33.2l-10.9 6 2.4-12.1-9-8.4 12.2-1.5Z"],
  box: ["M6 15l18-9 18 9v18l-18 9-18-9Z", "M6 15l18 9 18-9", "M24 24v18"],
};

function Icon({ name, size, color = C.ink, stroke = 2 }: { name: keyof typeof ICONS; size: number; color?: string; stroke?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {ICONS[name].map((d) => (
        <Path key={d} d={d} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </Svg>
  );
}

/** Dashed guide across the sheet where the two labels are cut apart. */
function CutLine() {
  return (
    <View style={{ position: "absolute", left: 0, right: 0, top: "50%", flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 1, borderTopWidth: 0.6, borderTopColor: C.faint, borderStyle: "dashed" }} />
      <Text style={{ fontSize: 6.5, color: C.faint, letterSpacing: 1.5, paddingHorizontal: 8, textTransform: "uppercase" }}>
        Cortar aquí
      </Text>
      <View style={{ flex: 1, borderTopWidth: 0.6, borderTopColor: C.faint, borderStyle: "dashed" }} />
    </View>
  );
}

/* ─────────────────────────────── 1–3 labels ─────────────────────────────── */

function BoxLabel({ shipment, sender, index }: { shipment: Shipment; sender: Sender; index: number }) {
  return (
    <View
      style={{
        flex: 1,
        margin: 26,
        borderWidth: 1.4,
        borderColor: C.green,
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 26,
        justifyContent: "space-between",
      }}
    >
      <View style={[s.row, { justifyContent: "space-between", alignItems: "center" }]}>
        <Logo mark={30} word={104} />
        <View style={{ alignItems: "flex-end" }}>
          <Text style={s.label}>Pedido</Text>
          <Text style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{shipment.order.code}</Text>
        </View>
      </View>

      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 92, fontWeight: 600, letterSpacing: 8, lineHeight: 1.05 }}>FRÁGIL</Text>
        <Text style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: 3, color: C.greenDark, marginTop: 14 }}>
          EQUIPO ELECTRÓNICO · MANIPULAR CON CUIDADO
        </Text>
      </View>

      <View style={[s.row, { justifyContent: "center", gap: 46 }]}>
        {(
          [
            ["fragile", "Frágil"],
            ["up", "Este lado arriba"],
            ["dry", "Mantener seco"],
          ] as const
        ).map(([icon, text]) => (
          <View key={icon} style={{ alignItems: "center", width: 96 }}>
            <Icon name={icon} size={44} stroke={2.2} />
            <Text style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.2, marginTop: 6, textTransform: "uppercase" }}>{text}</Text>
          </View>
        ))}
      </View>

      <View
        style={[
          s.row,
          { justifyContent: "space-between", borderTopWidth: 0.7, borderTopColor: C.line, paddingTop: 9, fontSize: 9, color: C.muted },
        ]}
      >
        <Text>
          {sender.web} · WhatsApp {sender.phoneDisplay}
        </Text>
        <Text>
          {sender.city}, Perú · Cara {index} de 6
        </Text>
      </View>
    </View>
  );
}

function LabelSheet({ shipment, sender, sheet }: { shipment: Shipment; sender: Sender; sheet: number }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={{ flex: 1 }}>
        <BoxLabel shipment={shipment} sender={sender} index={sheet * 2 - 1} />
        <BoxLabel shipment={shipment} sender={sender} index={sheet * 2} />
      </View>
      <CutLine />
    </Page>
  );
}

/* ──────────────────────────── 4 shipping sheet ──────────────────────────── */

function Field({ label, value, size = 15, style }: { label: string; value: string; size?: number; style?: Style }) {
  return (
    <View style={[{ marginBottom: 14 }, style ?? {}]}>
      <Text style={s.label}>{label}</Text>
      <Text style={{ fontSize: size, fontWeight: 600, marginTop: 3, minHeight: size * 1.2 }}>{value || " "}</Text>
    </View>
  );
}

function ShippingSheet({ shipment, sender }: { shipment: Shipment; sender: Sender }) {
  const { customer, order } = shipment;
  const shalom = order.delivery === "shalom";
  const qrText = `${sender.whatsappUrl}?text=${encodeURIComponent(`Hola REVOLT, tengo una consulta sobre mi pedido ${order.code}.`)}`;

  return (
    <Page size="A4" style={[s.page, { padding: 40 }]}>
      <View style={[s.row, { justifyContent: "space-between", alignItems: "flex-end" }]}>
        <Logo mark={34} word={118} />
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>GUÍA DE ENVÍO</Text>
          <Text style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
            Pedido {order.code} · {longDate(order.date)}
          </Text>
        </View>
      </View>
      <View style={{ height: 1.2, backgroundColor: C.green, marginTop: 14, marginBottom: 22 }} />

      {/* PARA */}
      <View style={[s.row, { alignItems: "center", gap: 8, marginBottom: 8 }]}>
        <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.greenDark }}>PARA</Text>
        <Text style={[s.label, { letterSpacing: 1.2 }]}>· Destinatario</Text>
      </View>
      <View style={{ borderWidth: 1.6, borderColor: C.ink, borderRadius: 14, padding: 22 }}>
        <Field label="Nombre completo" value={customer.name} size={30} />
        <View style={[s.row, { gap: 24 }]}>
          <Field label="DNI" value={customer.dni} size={20} style={{ flex: 1 }} />
          <Field label="Celular" value={customer.phone} size={20} style={{ flex: 1 }} />
        </View>
        {shalom ? (
          <View style={[s.row, { gap: 24 }]}>
            <Field label="Ciudad de destino" value={customer.city} size={18} style={{ flex: 1 }} />
            <Field label="Agencia Shalom" value={customer.agency} size={18} style={{ flex: 1 }} />
          </View>
        ) : (
          <Field label="Entrega" value={`En persona · ${customer.city || sender.city}`} size={18} />
        )}
        {customer.address ? <Field label="Dirección / referencia" value={customer.address} size={13} style={{ marginBottom: 0 }} /> : null}
      </View>

      {/* DE */}
      <View style={[s.row, { alignItems: "center", gap: 8, marginTop: 22, marginBottom: 8 }]}>
        <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.greenDark }}>DE</Text>
        <Text style={[s.label, { letterSpacing: 1.2 }]}>· Remitente</Text>
      </View>
      <View style={[s.row, { borderWidth: 0.9, borderColor: C.line, borderRadius: 14, padding: 18, gap: 20 }]}>
        <View style={{ flex: 1.2 }}>
          <Text style={{ fontSize: 15, fontWeight: 700 }}>
            {sender.brand} · {sender.holder}
          </Text>
          <Text style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
            {sender.city}, Perú{sender.ruc ? ` · RUC ${sender.ruc}` : ""}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={s.label}>WhatsApp</Text>
          <Text style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>{sender.phoneDisplay}</Text>
        </View>
      </View>

      {/* Contents */}
      <View style={[s.row, { marginTop: 22, gap: 14 }]}>
        <View style={[s.row, { flex: 1, borderWidth: 0.9, borderColor: C.line, borderRadius: 14, padding: 16, gap: 12, alignItems: "center" }]}>
          <Icon name="laptop" size={34} color={C.greenDark} stroke={2} />
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Contenido</Text>
            <Text style={{ fontSize: 12.5, fontWeight: 600, marginTop: 3 }}>{order.laptop}</Text>
            <Text style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{order.contents}</Text>
          </View>
        </View>
        <View style={{ width: 150, borderWidth: 1.4, borderColor: C.ink, borderRadius: 14, alignItems: "center", justifyContent: "center", padding: 10 }}>
          <Icon name="fragile" size={28} stroke={2.2} />
          <Text style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3, marginTop: 4 }}>FRÁGIL</Text>
          <Text style={{ fontSize: 7.5, color: C.muted, letterSpacing: 1, marginTop: 1 }}>EQUIPO ELECTRÓNICO</Text>
        </View>
      </View>

      {/* Footer: QR + receiving tip */}
      <View style={{ flex: 1 }} />
      <View style={[s.row, { gap: 18, alignItems: "center", borderTopWidth: 0.7, borderTopColor: C.line, paddingTop: 16 }]}>
        <Qr value={qrText} size={78} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: 700 }}>¿Alguna consulta sobre tu envío?</Text>
          <Text style={{ fontSize: 10, color: C.muted, marginTop: 3, lineHeight: 1.45 }}>
            Escanea el código y escríbenos por WhatsApp con tu número de pedido. Al recogerla, verifica que la caja llegue cerrada y
            con las etiquetas REVOLT.
          </Text>
        </View>
      </View>
    </Page>
  );
}

/* ───────────────────────────── 5 thank-you letter ───────────────────────────── */

function Letter({ shipment, sender, reviewUrl }: { shipment: Shipment; sender: Sender; reviewUrl: string }) {
  const { customer, order } = shipment;
  const name = firstName(customer.name) || "amigo";
  const tips = [
    "Carga la batería al 100 % antes de un uso prolongado.",
    "Conéctate a Wi-Fi y deja que Windows termine sus actualizaciones.",
    "Usa siempre el cargador que viene en la caja.",
    `Tu laptop tiene ${sender.warrantyMonths} meses de garantía: guarda tu boleta y escríbenos ante cualquier falla.`,
  ];

  return (
    <Page size="A4" style={[s.page, { paddingVertical: 54, paddingHorizontal: 60 }]}>
      <View style={[s.row, { justifyContent: "space-between", alignItems: "center" }]}>
        <Logo mark={30} word={104} />
        <Text style={{ fontSize: 10, color: C.muted }}>
          {sender.city}, {longDate(order.date)}
        </Text>
      </View>
      <View style={[s.row, { marginTop: 18, marginBottom: 34, alignItems: "center" }]}>
        <View style={{ width: 44, height: 2, backgroundColor: C.green }} />
        <View style={{ flex: 1, height: 0.6, backgroundColor: C.line }} />
      </View>

      <Text style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.08 }}>¡Gracias por tu compra,</Text>
      <Text style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.08, color: C.greenDark }}>{name}!</Text>

      <View style={{ marginTop: 24, fontSize: 12.5, lineHeight: 1.6 }}>
        <Text>
          Hoy tu {order.laptop || "laptop"} empieza una nueva etapa contigo. Antes de salir de {sender.city} la revisamos, limpiamos y
          probamos a fondo para que llegue lista para estudiar, trabajar o crear.
        </Text>
        <Text style={{ marginTop: 10 }}>
          {sender.brand} nació con una idea simple: que tener una buena laptop no cueste una fortuna. Cada compra como la tuya nos ayuda a
          seguir creciendo, así que de verdad: gracias por confiar en nosotros.
        </Text>
        {shipment.note.trim() ? (
          <View style={{ marginTop: 14, borderLeftWidth: 2, borderLeftColor: C.green, paddingLeft: 12 }}>
            <Text style={{ color: C.ink }}>{shipment.note.trim()}</Text>
          </View>
        ) : null}
      </View>

      <Text style={[s.label, { marginTop: 28, marginBottom: 10, color: C.greenDark }]}>Primeros pasos</Text>
      {tips.map((tip, i) => (
        <View key={tip} style={[s.row, { gap: 12, marginBottom: 8, alignItems: "flex-start" }]}>
          <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: C.green, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 9.5, fontWeight: 700, color: C.greenDark }}>{i + 1}</Text>
          </View>
          <Text style={{ flex: 1, fontSize: 11.5, lineHeight: 1.5, paddingTop: 2 }}>{tip}</Text>
        </View>
      ))}

      <View style={{ flex: 1 }} />

      <View style={[s.row, { gap: 18, alignItems: "center", borderWidth: 0.9, borderColor: C.line, borderRadius: 16, padding: 16 }]}>
        <Qr value={reviewUrl} size={74} />
        <View style={{ flex: 1 }}>
          <View style={[s.row, { gap: 6, alignItems: "center" }]}>
            <Icon name="star" size={14} color={C.greenDark} stroke={2.4} />
            <Text style={{ fontSize: 13, fontWeight: 700 }}>¿Te gustó tu experiencia?</Text>
          </View>
          <Text style={{ fontSize: 10.5, color: C.muted, marginTop: 4, lineHeight: 1.45 }}>
            Escanea y cuéntanos qué te pareció: tu opinión aparecerá en nuestra web como compra verificada y ayuda a que más
            personas compren con confianza. Este código es solo tuyo. ¿Dudas? Escríbenos al {sender.phoneDisplay}.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 26 }}>
        <Text style={{ fontSize: 11.5, color: C.muted }}>Con cariño,</Text>
        <Text style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>{sender.holder}</Text>
        <Text style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>
          {sender.brand} · Laptops reacondicionadas · {sender.web}
        </Text>
      </View>
    </Page>
  );
}

/* ───────────────────────────── document ───────────────────────────── */

export function ShipmentPdf({ shipment, sender, reviewUrl }: { shipment: Shipment; sender: Sender; reviewUrl: string }) {
  return (
    <Document
      title={`REVOLT · Envío ${shipment.order.code} · ${shipment.customer.name}`}
      author={sender.brand}
      creator={sender.brand}
      language="es-PE"
    >
      {[1, 2, 3].map((sheet) => (
        <LabelSheet key={sheet} shipment={shipment} sender={sender} sheet={sheet} />
      ))}
      <ShippingSheet shipment={shipment} sender={sender} />
      <Letter shipment={shipment} sender={sender} reviewUrl={reviewUrl} />
    </Document>
  );
}
